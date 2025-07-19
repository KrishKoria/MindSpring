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
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(2500, { message: "Description must be at most 2500 characters long" }),
  smallDescription: z
    .string()
    .min(10, {
      message: "Small description must be at least 10 characters long",
    })
    .max(250, {
      message: "Small description must be at most 250 characters long",
    }),
  fileKey: z.string().min(1, { message: "File key is required" }),
  price: z.coerce.number().min(1, { message: "Price must be positive" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1" })
    .max(500, { message: "Duration must be at most 500" }),
  level: z.enum(courseLevel, { message: "Level is required" }),
  category: z.enum(courseCategories, {
    message: "Category is required",
  }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
});
