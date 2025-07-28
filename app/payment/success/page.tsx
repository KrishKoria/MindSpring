"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCelebration from "@/hooks/use-celebration";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  const { triggerConfetti } = useCelebration();
  useEffect(() => {
    triggerConfetti();
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-1 items-center justify-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <CheckIcon className="size-12 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="text-center mt-3 sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              Thank you! Your payment has been processed successfully. You can
              now get started with the course. Happy Learning!
            </p>
            <Link
              href={"/dashboard"}
              className={buttonVariants({
                variant: "outline",
                className: "mt-5 w-full",
              })}
            >
              <ArrowLeftIcon className="mr-2" />
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
