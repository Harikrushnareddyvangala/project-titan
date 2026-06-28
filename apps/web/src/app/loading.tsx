export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        <p className="text-zinc-500">
          Loading Project TITAN...
        </p>
      </div>
    </main>
  );
}