"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./db";
import { courseSchema, CourseSchemaType } from "./schema";
import { ApiResponse } from "./types";

export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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
