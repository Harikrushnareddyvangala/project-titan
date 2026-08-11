"use client";

import type {
  IntelligenceArtifact,
} from "@/types/intelligence";

interface IntelligenceArtifactLineageProps {
  artifacts: IntelligenceArtifact[];
  currentArtifactId: string;
}

export function IntelligenceArtifactLineage({
  artifacts,
  currentArtifactId,
}: IntelligenceArtifactLineageProps) {
  if (
    artifacts.length === 0
  ) {
    return null;
  }

  return (
    <section className="mt-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Artifact Lineage
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Evolution of this artifact
              across revisions.
            </p>
          </div>

          <span className="shrink-0 text-xs text-zinc-500">
            {artifacts.length}{" "}
            {artifacts.length === 1
              ? "revision"
              : "revisions"}
          </span>
        </div>

        <div className="mt-5 space-y-2">
          {artifacts.map(
            (artifact, index) => {
              const isCurrent =
                artifact.artifactId ===
                currentArtifactId;

              const isLast =
                index ===
                artifacts.length - 1;

              return (
                <div
                  key={
                    artifact.artifactId
                  }
                  className="relative"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        isCurrent
                          ? "border-cyan-400/40 bg-cyan-400/[0.08] text-cyan-300"
                          : "border-white/10 bg-white/[0.04] text-zinc-400",
                      ].join(" ")}
                    >
                      {index + 1}
                    </div>

                    <div
                      className={[
                        "min-w-0 flex-1 rounded-xl border p-3",
                        isCurrent
                          ? "border-cyan-400/30 bg-cyan-400/[0.05]"
                          : "border-white/10 bg-white/[0.02]",
                      ].join(" ")}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white">
                          v
                          {
                            artifact.version
                          }
                        </span>

                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-zinc-400">
                          {
                            artifact.status
                          }
                        </span>

                        {isCurrent ? (
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-2 py-0.5 text-xs font-semibold text-cyan-300">
                            Current
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {
                          artifact.artifactId
                        }
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Generated{" "}
                        {new Date(
                          artifact.generatedAt,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  </div>

                  {!isLast ? (
                    <div className="ml-[15px] h-4 border-l border-dashed border-white/10" />
                  ) : null}
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}