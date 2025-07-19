import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href={"/admin/courses/create"} className={buttonVariants()}>
          Create Courses
        </Link>
      </div>
      <div className="">
        <p className="text-muted-foreground">
          Here you can manage your courses. Click on a course to edit it.
        </p>
      </div>
    </>
  );
}
