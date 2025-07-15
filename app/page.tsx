import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="p-24">
      <ThemeToggle />
      {session ? (
        <div>
          <h1>Welcome back, {session.user.name}!</h1>
          <p>Your email is: {session.user.email}</p>
        </div>
      ) : (
        <div>
          <h1>Welcome to our app!</h1>
          <p>Please log in to continue.</p>
        </div>
      )}
    </div>
  );
}
