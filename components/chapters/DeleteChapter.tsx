"use client";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { deleteChapter } from "@/lib/actions";

export default function DeleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const onSubmit = async () => {
    startTransition(async () => {
      const { data: chapter, error } = await tryCatch(
        deleteChapter(chapterId, courseId)
      );
      if (error) {
        toast.error("Error deleting chapter");
        return;
      }
      if (chapter.status === "error") {
        toast.error(chapter.message);
        return;
      }
      toast.success(chapter.message);
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Trash2Icon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this chapter? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
