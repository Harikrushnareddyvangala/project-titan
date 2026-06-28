import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-6xl font-black">
        404
      </h1>

      <p className="text-zinc-500">
        The page you requested could not be found.
      </p>

      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        Return Home
      </Link>
    </main>
  );
}