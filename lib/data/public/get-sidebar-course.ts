import prisma from "@/lib/db";
import requireUser from "../user/require-user";
import { notFound } from "next/navigation";

export async function getSidebarCourse(courseSlug: string) {
  const session = await requireUser();
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: {
      id: true,
      title: true,
      slug: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      chapters: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: course.id,
      },
    },
  });
  if (!enrollment || enrollment.status !== "APPROVED") {
    return notFound();
  }
  return {
    course,
  };
}

export type SidebarCourseType = Awaited<ReturnType<typeof getSidebarCourse>>;
