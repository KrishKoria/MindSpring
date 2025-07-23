import { z } from "zod";

export const courseLevel = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const courseCategories = [
  "Development",
  "Data Science",
  "Machine Learning",
  "Mobile Development",
  "Game Development",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "Business",
  "Finance",
  "Music",
  "Photography",
  "Writing",
  "Health",
  "Education",
  "Lifestyle",
  "Marketing",
  "Sales",
  "Design",
] as const;
export const courseSchema = z.object({
  title: z
    .string()
    .min(2, { error: "Title must be at least 2 characters long" })
    .max(100),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters long" })
    .max(2500, { error: "Description must be at most 2500 characters long" }),
  smallDescription: z
    .string()
    .min(10, {
      error: "Small description must be at least 10 characters long",
    })
    .max(250, {
      error: "Small description must be at most 250 characters long",
    }),
  fileKey: z.string().min(1, { error: "File key is required" }),
  price: z.coerce.number<number>().min(1, { error: "Price must be positive" }),
  duration: z.coerce
    .number<number>()
    .min(1, { error: "Duration must be at least 1" })
    .max(500, { error: "Duration must be at most 500" }),
  level: z.enum(courseLevel, { error: "Level is required" }),
  category: z.enum(courseCategories, {
    error: "Category is required",
  }),
  slug: z.string().min(3, { error: "Slug must be at least 3 characters long" }),
  status: z.enum(courseStatus, { error: "Status is required" }),
});

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { error: "File name is required" }),
  contentType: z.string().min(1, { error: "Content type is required" }),
  size: z.number().min(1, { error: "File size must be positive" }),
  isImage: z.boolean().optional(),
});
