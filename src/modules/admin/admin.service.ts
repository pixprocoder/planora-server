import { prisma } from "../../lib/prisma";

const getDashboardStatsFromDB = async () => {
  const [totalUsers, totalEvents, totalCategories, totalJoinRequests] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.category.count(),
    prisma.joinRequest.count(),
  ]);

  // Calculate Revenue: Sum fee for all COMPLETED payments
  const completedPayments = await prisma.joinRequest.findMany({
    where: {
      paymentStatus: "COMPLETED",
    },
    include: {
      event: {
        select: {
          fee: true,
        },
      },
    },
  });

  const totalRevenue = completedPayments.reduce(
    (acc, curr) => acc + (curr.event?.fee || 0),
    0
  );

  // Fetch 5 most recent upcoming events
  const recentEvents = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 5,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    totalUsers,
    totalEvents,
    totalCategories,
    totalJoinRequests,
    totalRevenue,
    recentEvents,
  };
};

export const adminService = {
  getDashboardStatsFromDB,
};
