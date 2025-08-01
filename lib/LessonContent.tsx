"use client";
import { Button } from "@/components/ui/button";
import { LessonContentType } from "./data/public/get-lesson-content";
import { BookIcon, CheckCircle } from "lucide-react";
import useConstructUrl from "@/hooks/use-construct-url";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { markCompletion } from "./actions";
import { toast } from "sonner";
import useCelebration from "@/hooks/use-celebration";
import RenderRTClient from "@/components/RTE/RenderRTClient";

export default function LessonContent({ data }: { data: LessonContentType }) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useCelebration();
  const handleCompletion = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markCompletion(data.id, data.Chapter.Course.slug)
      );
      if (error) {
        toast.error("Failed to mark lesson as complete");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        {data.progress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/20 text-green-500 hover:text-green-600"
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleCompletion}
            disabled={pending}
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderRTClient content={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}

function VideoPlayer({
  thumbnailKey,
  videoKey,
}: {
  thumbnailKey: string;
  videoKey: string;
}) {
  const thumbnailUrl = useConstructUrl(thumbnailKey);
  const videoUrl = useConstructUrl(videoKey);
  if (!videoKey) {
    return (
      <div
        className="aspect-video bg-muted rounded-lg flex flex-col items-center
          justify-center"
      >
        <BookIcon className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          This lesson does not have a video.
        </p>
      </div>
    );
  }
  return (
    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-cover"
        poster={thumbnailUrl}
      >
        <source src={videoKey} type="video/mp4" />
        <source src={videoKey} type="video/webm" />
        <source src={videoKey} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
