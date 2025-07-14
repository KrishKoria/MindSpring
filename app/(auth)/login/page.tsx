import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { GithubIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          Login with your Github or Email to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" variant="outline">
          <GithubIcon className="size-4" />
          Continue with Github
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
