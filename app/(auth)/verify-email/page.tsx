"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [verifyOtp, startVerifyOtp] = useTransition();
  const params = useSearchParams();
  const email = decodeURIComponent(params.get("email") || "");
  const router = useRouter();
  const isOtpValid = otp.length === 6;
  function handleVerifyOtp() {
    startVerifyOtp(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Email verified successfully! You are now logged in."
            );
            router.push("/");
          },
          onError: (error) => {
            toast.error(`Verification failed: ${error.error.message}`);
          },
        },
      });
    });
  }
  return (
    <Card className="w-full mx-auto mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please Check Your Email</CardTitle>
        <CardDescription>
          We have sent you an email with a verification link. Please click on
          the link to verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email.
          </p>
        </div>
        <Button
          onClick={handleVerifyOtp}
          disabled={verifyOtp || !isOtpValid}
          className="w-full"
        >
          {verifyOtp ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
export function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader2 className="size-6 animate-spin" />}>
      <VerifyEmail />
    </Suspense>
  );
}
