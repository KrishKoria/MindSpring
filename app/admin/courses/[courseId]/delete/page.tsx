"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { deleteCourse } from "@/lib/actions";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteCoursePage() {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const onSubmit = () => {
    startTransition(async () => {
      const { data: courseData, error } = await tryCatch(
        deleteCourse(courseId)
      );
      if (error) {
        toast.error("Failed to delete course");
        return;
      }
      if (courseData.status === "success") {
        toast.success(courseData.message);
        router.push("/admin/courses");
      } else if (courseData.status === "error") {
        toast.error(courseData.message);
      }
    });
  };
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Are you sure you want to delete this course?
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link
            href={`/admin/courses/`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>
          <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
            {pending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
