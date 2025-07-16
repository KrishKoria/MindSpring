"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();
  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully logged out");
          router.push("/");
        },
        onError: (error) => {
          toast.error(
            `Failed to log out: ${error.error?.message || "Unknown error"}`
          );
        },
      },
    });
  };
  return handleSignOut;
}
