"use client";
import { SidebarCourseType } from "@/lib/data/public/get-sidebar-course";
import { useMemo } from "react";

interface useCourseProgressProps {
  courseData: SidebarCourseType["course"];
}

interface CourseProgressResult {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}
export function useCourseProgress({ courseData }: useCourseProgressProps) {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;
    courseData.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;
        if (Array.isArray(lesson.progress)) {
          const isCompleted = lesson.progress.some(
            (p) => p.lessonId === lesson.id && p.completed
          );
          if (isCompleted) {
            completedLessons++;
          }
        }
      });
    });
    const progressPercentage = totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };
  }, [courseData]);
}
