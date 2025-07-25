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
            <form className="space-y-6">
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
              <Button type="submit">Save Lesson</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
