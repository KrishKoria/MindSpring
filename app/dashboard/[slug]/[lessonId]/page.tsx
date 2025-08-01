import LessonSkeleton from "@/components/LessonSkeleton";
import { getLessonContent } from "@/lib/data/public/get-lesson-content";
import LessonContent from "@/lib/LessonContent";
import { Suspense } from "react";

interface LessonContentPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}
export default async function LessonContentPage({
  params,
}: LessonContentPageProps) {
  const { lessonId } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);
  return <LessonContent data={data} />;
}
