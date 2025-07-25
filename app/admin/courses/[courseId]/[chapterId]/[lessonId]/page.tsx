import LessonForm from "@/components/lessons/LessonForm";
import { getLesson } from "@/lib/data/admin/get-lesson";

type LessonPageProps = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonPage({
  params,
}: {
  params: LessonPageProps;
}) {
  const { courseId, chapterId, lessonId } = await params;
  const lesson = await getLesson(lessonId);
  return <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />;
}
