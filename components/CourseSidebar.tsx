import { SidebarCourseType } from "@/lib/data/public/get-sidebar-course";
import { ChevronDown, Play } from "lucide-react";
import { Progress } from "./ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";

interface CourseSidebarProps {
  course: SidebarCourseType["course"];
}

export default function CourseSidebar({ course }: CourseSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">4/10</span>
          </div>
          <Progress value={55} className="h-1.5" />
          <p className="text-xs text-muted-foreground">55% completed</p>
        </div>
      </div>

      <div className="py-4 pr-4 space-y-3">
        {course.chapters.map((chapter, index) => (
          <Collapsible
            key={chapter.id}
            className="space-y-1"
            defaultOpen={index === 0}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full p-3 h-auto flex items-center gap-2"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <p key={lesson.id} className="text-sm text-muted-foreground">
                  {lesson.title}
                </p>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
