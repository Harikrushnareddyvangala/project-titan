"use client";

import {
  useState,
} from "react";

import {
  runArtifactLifecycleTest,
  type ArtifactLifecycleTestResult,
} from "@/lib/intelligence/artifactLifecycleTest";

export default function ArtifactLifecycleTestPage() {
  const [
    result,
    setResult,
  ] =
    useState<ArtifactLifecycleTestResult | null>(
      null,
    );

  function runTest() {
    setResult(
      runArtifactLifecycleTest(),
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Project TITAN
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Artifact Lifecycle Test
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Validates the controlled lifecycle
          transition policy for Intelligence
          Artifacts.
        </p>

        <button
          type="button"
          onClick={runTest}
          className="mt-8 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
        >
          Run Lifecycle Verification
        </button>

        {result ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="space-y-4">
              <ResultRow
                label="Legal transitions"
                passed={
                  result.legalTransitionsPassed
                }
              />

              <ResultRow
                label="Illegal transitions"
                passed={
                  result.illegalTransitionsPassed
                }
                />

              <ResultRow
                label="Overall lifecycle policy"
                passed={
                  result.allPassed
                }
              />
            </div>

            {result.failures.length > 0 ? (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-300">
                  Failures
                </p>

                <ul className="mt-3 space-y-2 text-sm text-red-200">
                  {result.failures.map(
                    (
                      failure,
                      index,
                    ) => (
                      <li key={index}>
                        {failure}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ) : null}

            {result.allPassed ? (
              <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4">
                <p className="text-sm font-bold text-emerald-300">
                  ARTIFACT LIFECYCLE TEST PASSED
                </p>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}

function ResultRow({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <span className="text-sm text-zinc-300">
        {label}
      </span>

      <span
        className={
          passed
            ? "text-sm font-bold text-emerald-300"
            : "text-sm font-bold text-red-300"
        }
      >
        {passed
          ? "PASS"
          : "FAIL"}
      </span>
    </div>
  );
}