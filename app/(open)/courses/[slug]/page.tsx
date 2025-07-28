import EnrollmentButton from "@/components/EnrollmentButton";
import RenderRT from "@/components/RTE/render";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import useConstructUrl from "@/hooks/use-construct-url";
import getCourse from "@/lib/data/public/get-course";
import { getUserEnrollment } from "@/lib/data/user/get-enrollment";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Params = Promise<{ slug: string }>;
export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  const url = useConstructUrl(course.fileKey);
  const isEnrolled = await getUserEnrollment(course.id);
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={url}
            alt={`${slug} course cover`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration}</span>
            </Badge>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              What you'll learn
            </h2>
            <RenderRT content={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">Content</h2>
            <div className="">
              {course.chapters.length} chapters |{" "}
              {course.chapters.reduce(
                (acc, chapter) => acc + chapter.lessons.length,
                0
              ) || 0}{" "}
              Lessons
            </div>
          </div>
          <div className="space-y-4">
            {course.chapters.map((chapter, idx) => (
              <Collapsible key={chapter.id} defaultOpen={idx === 0}>
                <Card className="p-0 gap-0 overflow-hidden border-2 transition-all duration-200 hover:border-primary">
                  <CollapsibleTrigger>
                    <div>
                      <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                              {idx + 1}
                            </p>
                            <div>
                              <h3 className="text-xl font-semibold text-left">
                                {chapter.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 text-left">
                                {chapter.lessons.length} lesson
                                {chapter.lessons.length !== 1 && "s"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={"outline"} className="text-xs">
                              {chapter.lessons.length} lesson
                              {chapter.lessons.length !== 1 && "s"}
                              <IconChevronDown className="size-5 text-muted-foreground" />
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t bg-muted/20">
                      <div className="p-6 pt-4 space-y-3">
                        {chapter.lessons.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent/50 transition-colors group"
                          >
                            <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                              <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Lesson {idx + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Price:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(course.price)}
                </span>
              </div>
              <div className="mb-6 space-y-3 rounded-lg  bg-primary/10 p-4">
                <h4 className="font-medium">What you'll get</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">
                          {course.duration} hours
                        </span>{" "}
                        of learning content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">
                          {course.level.charAt(0).toUpperCase() +
                            course.level.slice(1).toLowerCase()}
                        </span>{" "}
                        mastery: Perfect for {course.level.toLowerCase()}{" "}
                        learners ready to level up!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconCategory className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Dive deep into the world of{" "}
                        {
                          <span className="font-semibold text-primary">
                            {course.category.charAt(0).toUpperCase() +
                              course.category.slice(1).toLowerCase()}
                          </span>
                        }
                        —explore, learn, and master!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">
                          {(() => {
                            const lessonCount = course.chapters.reduce(
                              (acc, chapter) => acc + chapter.lessons.length,
                              0
                            );
                            return lessonCount === 1
                              ? "1 engaging"
                              : `${lessonCount} action-packed`;
                          })()}
                        </span>
                        {` lesson${
                          course.chapters.reduce(
                            (acc, chapter) => acc + chapter.lessons.length,
                            0
                          ) !== 1
                            ? "s"
                            : ""
                        }`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-3">
                <h4>
                  This course is designed to be accessible and engaging for all
                  learners, regardless of their background or experience level.
                </h4>
                <Separator className="text-accent-foreground border-1" />
                <h4>This Course Includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Engaging video lessons</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Interactive quizzes and assignments</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Hands-on projects and case studies</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
              {isEnrolled ? (
                <Link
                  href={`/dashboard`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  Get Started
                </Link>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Join our community of learners and start your journey today!{" "}
                <br />
                Cancel anytime, no questions asked.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
