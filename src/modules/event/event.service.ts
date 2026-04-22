import { Event } from "@prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const createEventIntoDB = async (payload: Event, userId: string) => {
  // 1. High-fidelity status check
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { status: true },
  });

  if (user.status === "BANNED") {
    throw new AppError(
      403,
      "Your account has been restricted by platform authority.",
    );
  }

  // 2. Temporal validation
  const eventDate = new Date(payload.date);
  if (eventDate < new Date()) {
    throw new AppError(400, "Event date must be in the future to maintain discovery node integrity.");
  }

  const result = await prisma.event.create({
    data: {
      ...payload,
      organizerId: userId,
      date: eventDate,
      capacity: Number(payload.capacity) || 0,
      isDeleted: false,
    },
  });
  return result;
};

const getAllEventsFromDB = async (query: any, isAdmin: boolean = false) => {
  const { search, category } = query;

  const result = await prisma.event.findMany({
    where: {
      isDeleted: false, // High-fidelity: Filter out deleted nodes
      ...(!isAdmin && { visibility: "PUBLIC" }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { categoryId: category }),
    },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      _count: {
        select: {
          requests: {
            where: { status: "APPROVED" },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  return result;
};

const getSingleEventFromDB = async (id: string) => {
  const result = await prisma.event.findUniqueOrThrow({
    where: { id },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      _count: {
        select: {
          requests: {
            where: { status: "APPROVED" },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const getMyEventsFromDB = async (userId: string) => {
  const result = await prisma.event.findMany({
    where: {
      organizerId: userId,
      isDeleted: false, // Ensure deleted events don't show in my events
    },
    include: {
      category: true,
      _count: {
        select: {
          requests: {
            where: { status: "PENDING" }
          },
          reviews: true,
        },
      },
      requests: {
        where: { status: "APPROVED" },
        select: { id: true }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updateEventInDB = async (
  id: string,
  userId: string,
  role: string,
  payload: Partial<Event>,
) => {
  // Check ownership unless admin
  const event = await prisma.event.findUniqueOrThrow({ where: { id } });

  if (role !== "ADMIN" && event.organizerId !== userId) {
    throw new Error("You are not authorized to update this event!");
  }

  const result = await prisma.event.update({
    where: { id },
    data: {
      ...payload,
      ...(payload.date && { date: new Date(payload.date) }),
    },
  });
  return result;
};

const deleteEventFromDB = async (id: string, userId: string, role: string) => {
  // 1. High-fidelity ownership and existence check
  const event = await prisma.event.findUniqueOrThrow({ 
    where: { id },
    include: {
      _count: {
        select: {
          requests: {
            where: { status: "APPROVED" }
          }
        }
      }
    }
  });

  if (role !== "ADMIN" && event.organizerId !== userId) {
    throw new AppError(403, "You are not authorized to moderate this discovery node.");
  }

  // 2. Mission-critical guardrail: Check for active participants
  if (event._count.requests > 0) {
    throw new AppError(400, "This event has active participants and cannot be deleted. Please use the cancellation flow.");
  }

  // 3. Surgical Soft Delete
  const result = await prisma.event.update({
    where: { id },
    data: {
      isDeleted: true
    }
  });
  return result;
};

export const eventService = {
  createEventIntoDB,
  getAllEventsFromDB,
  getSingleEventFromDB,
  getMyEventsFromDB,
  updateEventInDB,
  deleteEventFromDB,
};
