import prisma from "@/lib/db";
import requireUser from "./require-user";

export default async function getEnrolledCourses() {
  const user = await requireUser();
  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
    },
    select: {
      Course: {
        select: {
          id: true,
          description: true,
          category: true,
          title: true,
          slug: true,
          smallDescription: true,
          fileKey: true,
          level: true,
          duration: true,
          chapters: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  progress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return data;
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
