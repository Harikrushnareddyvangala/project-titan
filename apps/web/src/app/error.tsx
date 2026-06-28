"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorProps) {
  console.error(error);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Something went wrong
      </h1>

      <p className="text-zinc-500">
        An unexpected error occurred.
      </p>

      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        Try Again
      </button>
    </main>
  );
}