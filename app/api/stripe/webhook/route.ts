import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      if (!userId || !plan) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const item = subscription.items.data[0];
      const periodEnd = item ? new Date(item.current_period_end * 1000) : null;

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: item?.price.id,
          stripeCurrentPeriodEnd: periodEnd,
          plan: plan === "GROWTH" ? "GROWTH" : "STARTER",
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        invoice.parent?.subscription_details?.subscription as string | undefined;
      if (!subscriptionId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customer = await stripe.customers.retrieve(
        invoice.customer as string
      ) as Stripe.Customer;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customer.id },
      });
      if (!user) break;

      const item = subscription.items.data[0];
      const periodEnd = item ? new Date(item.current_period_end * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCurrentPeriodEnd: periodEnd },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      ) as Stripe.Customer;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customer.id },
      });
      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          plan: "FREE",
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
