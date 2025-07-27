import "server-only";
import requireAdmin from "./require-admin";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function getCourseData(id: string) {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      fileKey: true,
      duration: true,
      level: true,
      price: true,
      status: true,
      smallDescription: true,
      category: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });
  if (!course) {
    return notFound();
  }

  return course;
}

export type AdminCourseType = Awaited<ReturnType<typeof getCourseData>>;
