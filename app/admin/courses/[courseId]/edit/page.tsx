import CourseStructure from "@/components/CourseStructure";
import EditCourseForm from "@/components/EditCourseForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetCourse from "@/lib/data/admin/get-course";

type Params = Promise<{ courseId: string }>;
export default async function EditCourse({ params }: { params: Params }) {
  const { courseId } = await params;

  const course = await GetCourse(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course:{" "}
        <span className="text-primary underline"> {course?.title}</span>
      </h1>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Edit Basic Information</CardTitle>
              <CardDescription>
                Edit basic information of the course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm course={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Edit Course Structure</CardTitle>
              <CardDescription className="mb-2">
                Edit the structure of the course.
              </CardDescription>
              <CardContent>
                <CourseStructure data={course} />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
