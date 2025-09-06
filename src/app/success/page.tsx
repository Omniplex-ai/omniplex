export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-500">✅ Payment Successful!</h1>
      <p className="mt-4 text-lg">Thank you for upgrading to Premium 🚀</p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back Home
      </a>
    </div>
  );
}
