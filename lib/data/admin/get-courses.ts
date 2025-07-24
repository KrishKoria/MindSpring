import prisma from "@/lib/db";
import requireAdmin from "./require-admin";

export default async function GetCourses() {
  const session = await requireAdmin();
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return courses;
}

export type AdminCoursesType = Awaited<ReturnType<typeof GetCourses>>[0];
