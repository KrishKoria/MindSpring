import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

const requireAdmin = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");
  if (session.user.role !== "admin") {
    redirect("/not-admin");
  }
  return session;
});

export default requireAdmin;
