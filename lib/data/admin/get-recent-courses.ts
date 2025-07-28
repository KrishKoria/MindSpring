import prisma from "@/lib/db";
import requireAdmin from "./require-admin";

export default async function getRecentCourses() {
  await requireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      createdAt: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
    take: 5,
  });

  return data;
}
