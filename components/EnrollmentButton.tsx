"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { courseEnrollment } from "@/lib/actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        courseEnrollment(courseId)
      );
      if (error) {
        toast.error("Failed to enroll in course");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      variant={"outline"}
      disabled={pending}
      onClick={onSubmit}
      className="w-full"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
}
