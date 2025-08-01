"use client";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import useConstructUrl from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { EnrolledCourseType } from "@/lib/data/user/get-enrolled";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Progress } from "../ui/progress";
interface CourseCardProps {
  course: EnrolledCourseType;
}
export default function CourseProgressCard({ course }: CourseCardProps) {
  const url = useConstructUrl(course.Course.fileKey);
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: course.Course as any });
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">
        {course.Course.level}
      </Badge>
      <Image
        src={url}
        alt={`${course.Course.title} - thumbnail`}
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/dashboard/${course.Course.slug}`}
          className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.Course.title}
        </Link>
        <p className="text-sm line-clamp-2 text-muted-foreground leading-tight mt-2">
          {course.Course.smallDescription}
        </p>
        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        <Link
          href={`/dashboard/${course.Course.slug}`}
          className={buttonVariants({
            class: "w-full mt-4",
          })}
          aria-label={`View course ${course.Course.title}`}
        >
          Learn More <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-3/4 h-6" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="w-8 h-4" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="w-8 h-4" />
          </div>
        </div>
        <Skeleton className="w-full h-10 mt-4 rounded-md" />
      </CardContent>
    </Card>
  );
}
