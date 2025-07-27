import prisma from "@/lib/db";

export default async function getAllCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      title: true,
      slug: true,
      description: true,
      smallDescription: true,
      fileKey: true,
      id: true,
      level: true,
      duration: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
