"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully logged out");
          router.push("/");
        },
      },
    });
  }
  return (
    <div className="p-24">
      <ThemeToggle />
      {session ? (
        <div>
          <h1>Welcome back, {session.user.name}!</h1>
          <p>Your email is: {session.user.email}</p>
          <Button onClick={() => authClient.signOut()}>Logout</Button>
        </div>
      ) : (
        <div>
          <h1>Welcome to our app!</h1>
          <p>Please log in to continue.</p>
          <Button onClick={() => router.push("/login")}>Login</Button>
        </div>
      )}
    </div>
  );
}
