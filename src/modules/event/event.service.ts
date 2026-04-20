import { Event } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createEventIntoDB = async (payload: Event, userId: string) => {
  const result = await prisma.event.create({
    data: {
      ...payload,
      organizerId: userId,
      date: new Date(payload.date), // Ensure it's a Date object
    },
  });
  return result;
};

const getAllEventsFromDB = async (query: any) => {
  const { search, category } = query;

  const result = await prisma.event.findMany({
    where: {
      visibility: "PUBLIC",
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
    },
    include: {
      category: true,
      _count: {
        select: {
          requests: true,
          reviews: true,
        },
      },
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
  // Check ownership unless admin
  const event = await prisma.event.findUniqueOrThrow({ where: { id } });

  if (role !== "ADMIN" && event.organizerId !== userId) {
    throw new Error("You are not authorized to delete this event!");
  }

  const result = await prisma.event.delete({
    where: { id },
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
