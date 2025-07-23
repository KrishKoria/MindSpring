"use server";
import prisma from "./db";
import { courseSchema, CourseSchemaType } from "./schema";
import { ApiResponse } from "./types";
import requireAdmin from "./data/admin/require-admin";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

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
    const isProtected = await aj.protect(req, {
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
