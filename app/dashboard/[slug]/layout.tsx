import CourseSidebar from "@/components/CourseSidebar";
import { getSidebarCourse } from "@/lib/data/public/get-sidebar-course";

interface DashboardCourseLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function DashboardCourseLayout({
  children,
  params,
}: Readonly<DashboardCourseLayoutProps>) {
  const { slug } = await params;
  const course = await getSidebarCourse(slug);
  return (
    <div className="flex flex-1">
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={course.course} />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
