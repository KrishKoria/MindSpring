import AdminCourseCard from "@/components/AdminCourseCard";
import { buttonVariants } from "@/components/ui/button";
import GetCourses from "@/lib/data/admin/get-courses";
import Link from "next/link";

export default async function CoursesPage() {
  const data = await GetCourses();
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No courses found.</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href={"/admin/courses/create"} className={buttonVariants()}>
          Create Courses
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        {data.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
