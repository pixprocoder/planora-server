import { prisma } from "../../lib/prisma";

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          organizedEvents: true,
          joinRequests: true,
          reviews: true,
        }
      }
    }
  });
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updateProfileInDB = async (userId: string, payload: Partial<{ name: string; phone: string; image: string }>) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
  return result;
};

const updateUserStatusInDB = async (userId: string, status: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  return result;
};

export const userService = {
  getMyProfileFromDB,
  getAllUsersFromDB,
  updateProfileInDB,
  updateUserStatusInDB,
};

