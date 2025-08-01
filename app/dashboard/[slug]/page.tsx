import { getSidebarCourse } from "@/lib/data/public/get-sidebar-course";
import { redirect } from "next/navigation";

interface DashboardCoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardCoursePage({
  params,
}: DashboardCoursePageProps) {
  const { slug } = await params;
  const course = await getSidebarCourse(slug);
  const firstChapter = course.course.chapters[0];
  const firstLesson = firstChapter.lessons[0];
  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No Lessons Available</h2>
      <p className="text-muted-foreground">
        It seems like there are no lessons available in this course yet. Please
        check back later or contact support if you believe this is an error.
      </p>
    </div>
  );
}
