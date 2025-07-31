import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/Empty";
import getAllCourses from "@/lib/data/public/get-all-courses";
import getEnrolledCourses from "@/lib/data/user/get-enrolled";
import Link from "next/link";

export default async function DashboardPage() {
  const [allCourses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No Enrolled Courses"
          description="Looks like you haven't enrolled in any courses yet."
          href="/courses"
          buttonText="Browse Courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <Link
              href={`/dashboard/${course.Course.slug}`}
              key={course.Course.id}
            >
              {course.Course.title}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can enroll in.
          </p>
        </div>
        {allCourses.filter(
          (course) =>
            !enrolledCourses.some(
              (enrollment) => enrollment.Course.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No Available Courses"
            description="Looks like there are no courses available for enrollment."
            href="/courses"
            buttonText="Browse Courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allCourses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    (enrollment) => enrollment.Course.id === course.id
                  )
              )
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
