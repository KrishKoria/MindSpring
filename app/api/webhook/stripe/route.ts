import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Error constructing Stripe event:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed":
      const courseId = session.metadata?.courseId;
      const customerId = session.customer as string;
      if (!courseId) {
        throw new Error("Course ID is missing");
      }
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });
      if (!user) {
        throw new Error("User not found ");
      }
      await prisma.enrollment.update({
        where: { id: session.metadata?.enrollmentId },
        data: {
          userId: user.id,
          courseId: courseId,
          amount: session.amount_total as number,
          status: "APPROVED",
        },
      });
      break;
    default:
      console.warn("Unhandled event type:", event.type);
  }

  return new Response("Webhook received", { status: 200 });
}
