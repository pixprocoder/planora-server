import { RequestStatus } from "@prisma/client";
import { UserRole } from "../../constants/user";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const createJoinRequestIntoDB = async (eventId: string, userId: string) => {
  // 1. Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, "Event not found");
  }

  // 2. Prevent organizer from joining their own event
  if (event.organizerId === userId) {
    throw new AppError(400, "Organizers cannot join their own events");
  }

  // 3. Check if user is banned from this event
  const existingRequest = await prisma.joinRequest.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  if (existingRequest?.status === "BANNED") {
    throw new AppError(403, "You are banned from participating in this event");
  }

  if (existingRequest) {
    throw new AppError(409, "You have already sent a request for this event");
  }

  // 4. Create request
  const isPublicFree = event.visibility === "PUBLIC" && event.fee === 0;

  const result = await prisma.joinRequest.create({
    data: {
      eventId,
      userId,
      status: isPublicFree ? "APPROVED" : "PENDING",
      paymentStatus: isPublicFree ? "COMPLETED" : "PENDING",
    },
  });


  return result;
};

const updateJoinRequestStatusInDB = async (
  requestId: string,
  status: RequestStatus,
  userId: string,
  role: string,
) => {
  // 1. Check if request exists
  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id: requestId },
    include: { event: true },
  });

  if (!joinRequest) {
    throw new AppError(404, "Join request not found");
  }

  // 2. Authorization check: Only organizer or admin
  if (role !== UserRole.ADMIN && joinRequest.event.organizerId !== userId) {
    throw new AppError(
      403,
      "You are not authorized to manage requests for this event",
    );
  }

  // 3. Update status
  const result = await prisma.joinRequest.update({
    where: { id: requestId },
    data: { status },
  });

  return result;
};

const getMyRequestsFromDB = async (userId: string) => {
  const result = await prisma.joinRequest.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          organizer: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getEventRequestsFromDB = async (
  eventId: string,
  userId: string,
  role: string,
) => {
  // 1. Check authorization
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new AppError(404, "Event not found");
  }

  if (role !== UserRole.ADMIN && event.organizerId !== userId) {
    throw new AppError(
      403,
      "You are not authorized to view requests for this event",
    );
  }

  const result = await prisma.joinRequest.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getOrganizerRequestsFromDB = async (userId: string) => {
  const result = await prisma.joinRequest.findMany({
    where: {
      event: {
        organizerId: userId,
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, image: true },
      },
      event: {
        select: { id: true, title: true, date: true, time: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10, // Only take the most recent 10 interactions for the overview
  });
  return result;
};

export const joinRequestService = {
  createJoinRequestIntoDB,
  updateJoinRequestStatusInDB,
  getMyRequestsFromDB,
  getEventRequestsFromDB,
  getOrganizerRequestsFromDB,
};
