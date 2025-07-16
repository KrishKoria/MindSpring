"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
interface Feature {
  title: string;
  description: string;
  icon: string;
}
const features: Feature[] = [
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with personalized progress tracking and insights.",
    icon: "📈",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with quizzes, discussions, and hands-on projects to reinforce your understanding.",
    icon: "🎮",
  },
  {
    title: "Comprehensive Resources",
    description:
      "Access a wide range of carefully curated courses designed by industry experts to enhance your knowledge.",
    icon: "📚",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and educators to share knowledge, ask questions, and collaborate.",
    icon: "🤝",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>The Future of Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your learning Experience
          </h1>
          <p className="max-w-[700px] md:text-xl text-muted-foreground">
            Discover a new way to learn and grow with our innovative platform.
            <br />
            Access a wide range of resources, and join a community of learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
