import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "@/components/AdminCourseCard";
import EmptyState from "@/components/Empty";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import getChartData from "@/lib/data/admin/get-chart-data";
import getRecentCourses from "@/lib/data/admin/get-recent-courses";
import Link from "next/link";
import { Suspense } from "react";
export default async function AdminPage() {
  const enrollmentData = await getChartData();
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href="/admin/courses"
          >
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await getRecentCourses();
  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create a New Course"
        description="Looks like you haven't created any courses yet."
        title="No Courses Found"
        href="/admin/courses/create"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
