import { SidebarCourseType } from "@/lib/data/public/get-sidebar-course";
import { ChevronDown, Play } from "lucide-react";
import { Progress } from "./ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import LessonItem from "./LessonItem";

interface CourseSidebarProps {
  course: SidebarCourseType["course"];
}

export default function CourseSidebar({ course }: CourseSidebarProps) {
  return (
    <div className="flex flex-col h-full p-6 gap-8">
      <div className="pb-6 pr-6 border-b border-border">
        <div className="flex items-center gap-5 mb-6">
          <div className="size-5 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-md leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">4/10</span>
          </div>
          <Progress value={55} className="h-2" />
          <p className="text-sm text-muted-foreground">55% completed</p>
        </div>
      </div>

      <div className="py-1 pr-2 space-y-5">
        {course.chapters.map((chapter, index) => (
          <Collapsible
            key={chapter.id}
            className="space-y-2"
            defaultOpen={index === 0}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full p-2 h-auto flex items-center gap-2 text-lg"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-5 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-[16px] truncate text-foreground">
                    {chapter.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-5 pl-4 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
