import { getLessonContent } from "@/lib/data/public/get-lesson-content";
import LessonContent from "@/lib/LessonContent";

interface LessonContentPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}
export default async function LessonContentPage({
  params,
}: LessonContentPageProps) {
  const { lessonId } = await params;
  const data = await getLessonContent(lessonId);
  return <LessonContent data={data} />;
}
