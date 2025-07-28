import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="w-full min-h-screen flex flex-1 items-center justify-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <XIcon className="size-12 bg-red-500/30 text-red-500 rounded-full" />
          </div>
          <div className="text-center mt-3 sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              No worries, your payment has been cancelled successfully. you have{" "}
              <span className="font-semibold">not been charged</span>. you can
              try again later if you wish.
            </p>
            <Link
              href={"/"}
              className={buttonVariants({
                variant: "outline",
                className: "mt-5 w-full",
              })}
            >
              <ArrowLeftIcon className="mr-2" />
              Go back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
