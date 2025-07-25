"use server";
import prisma from "./db";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
} from "./schema";
import { ApiResponse } from "./types";
import requireAdmin from "./data/admin/require-admin";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const protector = aj
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );
export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const isProtected = await protector.protect(req, {
      fingerprint: session.user.id,
    });
    if (isProtected.isDenied()) {
      return {
        status: "error",
        message: "Request Denied",
      };
    }
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form data",
      };
    }
    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id!,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
export async function EditCourse(
  id: string,
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const isProtected = await protector.protect(req, {
      fingerprint: session.user.id,
    });
    if (isProtected.isDenied()) {
      return {
        status: "error",
        message: "Request Denied",
      };
    }
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form data",
      };
    }
    await prisma.course.update({
      where: { id: id, userId: session.user.id },
      data: { ...validation.data },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessonUpdates: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const isProtected = await protector.protect(req, {
      fingerprint: session.user.id,
    });
    if (isProtected.isDenied()) {
      return {
        status: "error",
        message: "Request Denied",
      };
    }
    if (!lessonUpdates || lessonUpdates.length === 0) {
      return {
        status: "error",
        message: "No lessons to reorder",
      };
    }
    const updates = lessonUpdates.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.id, chapterId: chapterId },
        data: { position: lesson.position },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  chapterUpdates: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const isProtected = await protector.protect(req, {
      fingerprint: session.user.id,
    });
    if (isProtected.isDenied()) {
      return {
        status: "error",
        message: "Request Denied",
      };
    }
    if (!chapterUpdates || chapterUpdates.length === 0) {
      return {
        status: "error",
        message: "No chapters to reorder",
      };
    }
    const updates = chapterUpdates.map((chapter) =>
      prisma.chapter.update({
        where: { id: chapter.id, courseId: courseId },
        data: { position: chapter.position },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const isProtected = await protector.protect(req, {
      fingerprint: session.user.id,
    });
    if (isProtected.isDenied()) {
      return {
        status: "error",
        message: "Request Denied",
      };
    }
    const validation = chapterSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form data",
      };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: { courseId: validation.data.courseId },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      await tx.chapter.create({
        data: {
          title: validation.data.name,
          courseId: validation.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${validation.data.courseId}/edit`);
    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}
