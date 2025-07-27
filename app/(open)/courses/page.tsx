import CourseCard, { CourseCardSkeleton } from "@/components/CourseCard";
import getAllCourses from "@/lib/data/public/get-all-courses";
import { Suspense } from "react";

export default function PublicCoursesPage() {
  return (
    <>
      <div className="mt-5">
        <div className="flex flex-col space-y-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Explore Courses
          </h1>
          <p className="text-muted-foreground max-w-md">
            Discover a wide variety of courses to enhance your skills and
            knowledge.
          </p>
        </div>
        <Suspense fallback={<CourseCardSkeletonLayout />}>
          <RenderCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderCourses() {
  const courses = await getAllCourses();
  if (!courses) {
    return <p className="text-muted-foreground">No courses available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function CourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
