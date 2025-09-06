export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-500">❌ Payment Cancelled</h1>
      <p className="mt-4 text-lg">No worries, you can try again anytime.</p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Return Home
      </a>
    </div>
  );
}
