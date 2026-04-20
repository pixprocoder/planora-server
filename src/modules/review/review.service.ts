import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const createReviewIntoDB = async (
  payload: { eventId: string; rating: number; comment?: string },
  userId: string,
) => {
  // 1. Verify existence of the event
  const event = await prisma.event.findUnique({
    where: { id: payload.eventId },
  });

  if (!event) {
    throw new AppError(404, "Event not found");
  }

  // 2. Check if the user was an APPROVED participant
  const participation = await prisma.joinRequest.findUnique({
    where: {
      eventId_userId: {
        eventId: payload.eventId,
        userId: userId,
      },
    },
  });

  if (event.organizerId === userId) {
    throw new AppError(403, "Organizers cannot review their own events");
  }

  // 3. Status check: Must be approved
  if (!participation || participation.status !== "APPROVED") {
    throw new AppError(403, "Only approved participants can review this event");
  }

  // 4. Prevent duplicate reviews
  const existingReview = await prisma.review.findUnique({
    where: {
      eventId_userId: {
        eventId: payload.eventId,
        userId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(409, "You have already reviewed this event");
  }

  // 3. Check if event date has passed
  // if (new Date(event.date) > new Date()) {
  //   throw new AppError(400, "You can only review an event after it has taken place");
  // }

  // 4. Create review
  const result = await prisma.review.create({
    data: {
      ...payload,
      userId,
    },
  });

  return result;
};

const getEventReviewsFromDB = async (eventId: string) => {
  const result = await prisma.review.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const deleteReviewFromDB = async (
  reviewId: string,
  userId: string,
  role: string,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  // Authorization: Owner or Admin
  if (role !== "ADMIN" && review.userId !== userId) {
    throw new AppError(403, "You are not authorized to delete this review");
  }

  const result = await prisma.review.delete({
    where: { id: reviewId },
  });

  return result;
};

export const reviewService = {
  createReviewIntoDB,
  getEventReviewsFromDB,
  deleteReviewFromDB,
};
