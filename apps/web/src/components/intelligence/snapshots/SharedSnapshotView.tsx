"use client";

import { useRouter } from "next/navigation";

import { useSharedSnapshot } from "@/hooks/useSharedSnapshot";

import { IntelligenceSnapshotViewer } from "./IntelligenceSnapshotViewer";

export function SharedSnapshotView() {
  const router = useRouter();

  const sharedSnapshot =
    useSharedSnapshot();

  if (!sharedSnapshot) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.03] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Shared Intelligence
        </p>

        <p className="mt-2 text-sm text-zinc-400">
          You are viewing a shared repository
          intelligence snapshot.
        </p>
      </div>

      <IntelligenceSnapshotViewer
        snapshot={sharedSnapshot}
        onClose={() => {
          router.push(
            "/workspace/repository",
          );
        }}
      />
    </section>
  );
}