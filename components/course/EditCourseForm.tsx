"use client";
import { PlusIcon, SparkleIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import slugify from "slugify";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import RTEditor from "../RTE/editor";
import FileUploader from "../file-upload/uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  courseCategories,
  courseLevel,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AdminCourseType } from "@/lib/data/admin/get-course";
import { editCourse } from "@/lib/actions";

export default function EditCourseForm({
  course,
}: {
  course: AdminCourseType;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      smallDescription: course.smallDescription,
      fileKey: course.fileKey,
      price: course.price,
      duration: course.duration,
      level: course.level,
      category: course.category as CourseSchemaType["category"],
      slug: course.slug,
      status: course.status,
    },
  });
  const onSubmit = (data: CourseSchemaType) => {
    startTransition(async () => {
      const { data: courseData, error } = await tryCatch(
        editCourse(course.id, data)
      );
      if (error) {
        toast.error("Failed to Edit course");
        return;
      }
      if (courseData.status === "success") {
        toast.success(courseData.message);
        form.reset();
        router.push("/admin/courses");
      } else if (courseData.status === "error") {
        toast.error(courseData.message);
      }
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Title of the course"
                    className="input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Slug for the course"
                      className="input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              const title = form.getValues("title");
              form.setValue("slug", slugify(title), {
                shouldValidate: true,
              });
            }}
          >
            Generate Slug <SparkleIcon size={16} className="ml-1" />
          </Button>
        </div>
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Small Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Small description of the course"
                    className="min-h-[120px]"
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
              <FormItem className="w-full">
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
          name="fileKey"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Thumbnail Image</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onChange={field.onChange}
                    fileType="image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>LEVEL</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseLevel.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Duration" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>STATUS</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseStatus.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              Editing Course...
              <PlusIcon className="ml-1 animate-spin" size={16} />
            </>
          ) : (
            <>
              Edit Course <PlusIcon className="ml-1" size={16} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
