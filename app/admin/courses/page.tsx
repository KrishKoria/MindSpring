import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "@/components/course/AdminCourseCard";
import EmptyState from "@/components/Empty";
import { buttonVariants } from "@/components/ui/button";
import getCoursesData from "@/lib/data/admin/get-courses";
import Link from "next/link";
import { Suspense } from "react";

export default async function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href={"/admin/courses/create"} className={buttonVariants()}>
          Create Courses
        </Link>
      </div>
      <Suspense fallback={<RenderCoursesSkeleton />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const data = await getCoursesData();
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No courses found.</p>
      </div>
    );
  }
  return (
    <>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
          {data.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Courses Found"
          description="Looks like you haven't created any courses yet."
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      )}
    </>
  );
}

function RenderCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
