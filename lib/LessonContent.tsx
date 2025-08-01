import { Button } from "@/components/ui/button";
import { LessonContentType } from "./data/public/get-lesson-content";
import { BookIcon, CheckCircle } from "lucide-react";
import RenderRT from "@/components/RTE/render";
import useConstructUrl from "@/hooks/use-construct-url";

export default function LessonContent({ data }: { data: LessonContentType }) {
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        <Button variant="outline">
          <CheckCircle className="size-4 mr-2 text-green-500" />
          Mark as Complete
        </Button>
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderRT content={JSON.parse(data.description)} />
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
