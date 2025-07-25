"use client";
import { useState, useTransition } from "react";

import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { lessonSchema, LessonSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { tryCatch } from "@/hooks/try-catch";
import { createLesson } from "@/lib/actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function NewLessonModal({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  if (!courseId) {
    return null;
  }
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const onSubmit = async (values: LessonSchemaType) => {
    startTransition(async () => {
      const { data: lesson, error } = await tryCatch(createLesson(values));
      if (error) {
        toast.error("Error creating lesson");
        return;
      }
      if (lesson.status === "error") {
        toast.error(lesson.message);
        return;
      }
      toast.success(lesson.message);
      form.reset();
      setOpen(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full justify-center gap-1">
          <PlusIcon className="size-4" /> New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Lesson</DialogTitle>
          <DialogDescription>
            What would you like to name this lesson?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Lesson Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">
                {pending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
