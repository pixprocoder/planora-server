import { prisma } from "../../lib/prisma";

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
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

export const userService = {
  getMyProfileFromDB,
  getAllUsersFromDB,
};
