import CheckoutButton from "./PremiumButton";

export default function Premium() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Upgrade to Premium 🚀</h1>
      <p className="text-lg mb-6 text-gray-600">
        Get access to exclusive features by upgrading your plan.
      </p>
      <CheckoutButton />
    </section>
  );
}
