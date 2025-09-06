"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function PremiumButton() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const { id } = await res.json();

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      await stripe.redirectToCheckout({ sessionId: id });
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition"
    >
      ⭐ Go Premium
    </button>
  );
}
