import { PublicCoursesType } from "@/lib/data/public/get-all-courses";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import useConstructUrl from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, School, TimerIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
interface CourseCardProps {
  course: PublicCoursesType;
}
export default function CourseCard({ course }: CourseCardProps) {
  const url = useConstructUrl(course.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
      <Image
        src={url}
        alt={`${course.title} - thumbnail`}
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/courses/${course.slug}`}
          className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>
        <p className="text-sm line-clamp-2 text-muted-foreground leading-tight mt-2">
          {course.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.category}</p>
          </div>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className={buttonVariants({
            class: "w-full mt-4",
          })}
          aria-label={`View course ${course.title}`}
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
