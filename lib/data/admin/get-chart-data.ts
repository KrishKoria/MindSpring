import prisma from "@/lib/db";
import requireAdmin from "./require-admin";

export default async function getChartData() {
  await requireAdmin();
  const ThirtyDays = new Date();
  ThirtyDays.setDate(ThirtyDays.getDate() - 30);
  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: ThirtyDays,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const last30DaysData: { date: string; enrollments: number }[] = [];
  for (let index = 29; index >= 0; index--) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    last30DaysData.push({
      date: date.toISOString().split("T")[0],
      enrollments: 0,
    });
  }
  enrollments.forEach((enrollment) => {
    const date = enrollment.createdAt.toISOString().split("T")[0];
    const dataIndex = last30DaysData.findIndex((data) => data.date === date);
    if (dataIndex !== -1) {
      last30DaysData[dataIndex].enrollments += 1;
    }
  });
  return last30DaysData;
}
