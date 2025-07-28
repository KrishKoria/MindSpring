"use server";
import prisma from "./db";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "./schema";
import { ApiResponse } from "./types";
import requireAdmin from "./data/admin/require-admin";
import { aj, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import requireUser from "./data/user/require-user";
import { stripe } from "./stripe";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { env } from "./env";

const protector = aj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);
export async function createCourse(
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
    const data = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.description,
      default_price_data: {
        currency: "inr",
        unit_amount: validation.data.price * 100,
      },
    });
    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id!,
        stripePriceId: data.default_price as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
export async function editCourse(
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

export async function createLesson(
  values: LessonSchemaType
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
    const validation = lessonSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form data",
      };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: { chapterId: validation.data.chapterId },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      await tx.lesson.create({
        data: {
          title: validation.data.name,
          description: validation.data.description,
          videoKey: validation.data.videoKey,
          thumbnailKey: validation.data.thumbnailKey,
          chapterId: validation.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${validation.data.courseId}/edit`);
    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
}

export async function deleteLesson(
  chapterId: string,
  courseId: string,
  lessonId: string
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
    const chapterWithLesson = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });
    if (!chapterWithLesson) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }
    const lessonToDelete = chapterWithLesson.lessons.find(
      (lesson) => lesson.id === lessonId
    );
    if (!lessonToDelete) {
      return {
        status: "error",
        message: "Lesson not found",
      };
    }
    const remainingLessons = chapterWithLesson.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );
    const updates = remainingLessons.map((lesson, index) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: { id: lessonId, chapterId: chapterId },
      }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}

export async function deleteChapter(
  chapterId: string,
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
    const courseWithChapter = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapters: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });
    if (!courseWithChapter) {
      return {
        status: "error",
        message: "Course not found",
      };
    }
    const chapterToDelete = courseWithChapter.chapters.find(
      (chapter) => chapter.id === chapterId
    );
    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }
    const remainingChapters = courseWithChapter.chapters.filter(
      (chapter) => chapter.id !== chapterId
    );
    const updates = remainingChapters.map((chapter, index) =>
      prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: { id: chapterId },
      }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to delete chapter",
    };
  }
}

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
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
    const lesson = lessonSchema.safeParse(values);
    if (!lesson.success) {
      return {
        status: "error",
        message: "Invalid Form data",
      };
    }
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: lesson.data.name,
        description: lesson.data.description,
        videoKey: lesson.data.videoKey,
        thumbnailKey: lesson.data.thumbnailKey,
      },
    });
    revalidatePath(`/admin/courses/${lesson.data.courseId}/edit`);
    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
}

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
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
    if (!courseId) {
      return {
        status: "error",
        message: "Course ID is required",
      };
    }
    await prisma.course.delete({
      where: { id: courseId },
    });
    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}

export async function courseEnrollment(
  courseId: string
): Promise<ApiResponse | never> {
  const user = await requireUser();
  let checkoutURL: string;
  try {
    const req = await request();
    const isProtected = await protector.protect(req, {
      fingerprint: user.id,
    });
    if (isProtected.isDenied()) {
      return {
        status: "error",
        message: "Request Denied",
      };
    }
    if (!courseId) {
      return {
        status: "error",
        message: "Course ID is required",
      };
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true, slug: true },
    });
    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }
    const userStripeID = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });
    let stripeCustomerId = userStripeID?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
      stripeCustomerId = customer.id;
    }
    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        select: {
          status: true,
          id: true,
        },
      });
      if (existingEnrollment?.status === "APPROVED") {
        return {
          status: "success",
          message: "You are already enrolled in this course",
        };
      }
      let enrollment;
      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "PENDING",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "PENDING",
          },
        });
      }
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: "price_1Rpl3yFyazyApOXvaGNOlzhc",
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });
      return {
        enrollment: enrollment,
        checkoutURL: session.url,
      };
    });
    checkoutURL = result.checkoutURL!;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment processing error: " + error.message,
      };
    }
    return {
      status: "error",
      message: "Failed to enroll in course",
    };
  }
  redirect(checkoutURL);
}
