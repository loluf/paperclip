import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// Keep named export for convenience, but only used in non-module-level contexts
export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 9900,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    features: ["1 knowledge base", "500 AI responses/mo", "Email support"],
  },
  GROWTH: {
    name: "Growth",
    price: 19900,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID ?? "",
    features: ["5 knowledge bases", "2,000 AI responses/mo", "Priority support"],
  },
};
