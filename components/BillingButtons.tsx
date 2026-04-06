"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BillingButtons({
  plan,
  currentPlan,
}: {
  plan: string;
  currentPlan: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isCurrentPlan = currentPlan === plan;

  async function subscribe() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to create checkout session");
      setLoading(false);
    }
  }

  if (isCurrentPlan) {
    return (
      <button disabled className="w-full border py-2 rounded-lg text-sm text-gray-500 cursor-not-allowed">
        Current Plan
      </button>
    );
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-60"
    >
      {loading ? "Redirecting..." : "Subscribe"}
    </button>
  );
}
