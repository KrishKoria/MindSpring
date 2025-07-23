import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

export default async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");
  if (session.user.role !== "admin") {
    redirect("/not-admin");
  }
  return session;
}
