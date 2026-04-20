import { prisma } from "../../lib/prisma";

const createCategoryIntoDB = async (name: string) => {
  const result = await prisma.category.create({
    data: {
      name,
    },
  });
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  deleteCategoryFromDB,
};
