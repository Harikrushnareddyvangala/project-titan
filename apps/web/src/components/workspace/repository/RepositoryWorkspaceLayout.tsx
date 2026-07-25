import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function RepositoryWorkspaceLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
    </main>
  );
}