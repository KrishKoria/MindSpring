"use client";

import { LessonType } from "@/lib/data/admin/get-lesson";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, LessonSchemaType } from "@/lib/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import RTEditor from "../RTE/editor";
import FileUploader from "../file-upload/uploader";
import { tryCatch } from "@/hooks/try-catch";
import { updateLesson } from "@/lib/actions";
import { useTransition } from "react";
import { toast } from "sonner";

interface LessonFormProps {
  data: LessonType;
  chapterId: string;
  courseId: string;
}

export default function LessonForm({
  data,
  chapterId,
  courseId,
}: LessonFormProps) {
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values: LessonSchemaType) => {
    startTransition(async () => {
      const { data: lessonData, error } = await tryCatch(
        updateLesson(values, data.id)
      );
      if (error) {
        toast.error("Failed to update lesson");
        return;
      }
      if (lessonData.status === "success") {
        toast.success(lessonData.message);
      } else if (lessonData.status === "error") {
        toast.error(lessonData.message);
      }
    });
  };
  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({
          variant: "outline",
          className: "mb-6",
        })}
      >
        <ArrowLeftIcon className="size-4" />
        <span>Back</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
          <CardDescription>
            Add Video and Description for this Lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Title of the lesson"
                          className="input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RTEditor field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <FileUploader
                          onChange={field.onChange}
                          value={field.value}
                          fileType="image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Video File</FormLabel>
                      <FormControl>
                        <FileUploader
                          onChange={field.onChange}
                          value={field.value}
                          fileType="video"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save Lesson"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
