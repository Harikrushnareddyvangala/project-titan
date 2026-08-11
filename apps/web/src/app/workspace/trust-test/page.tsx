"use client";

import {
  useState,
} from "react";

import {
  runTrustRuntimeTest,
} from "@/lib/intelligence/trustRuntimeTest";

import {
  IntelligenceTrustKeyManager,
} from "@/components/intelligence/artifacts";

export default function TrustTestPage() {
  const [
    running,
    setRunning,
  ] = useState(false);

  const [
    result,
    setResult,
  ] = useState<
    Awaited<
      ReturnType<
        typeof runTrustRuntimeTest
      >
    > | null
  >(null);

  async function handleRun() {
    setRunning(true);

    try {
      const nextResult =
        await runTrustRuntimeTest();

      setResult(
        nextResult,
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Project TITAN
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Trust Runtime Verification
        </h1>

        <p className="mt-4 text-zinc-400">
          Development-only verification of the
          artifact signing and trust lifecycle.
        </p>

        <button
          type="button"
          onClick={handleRun}
          disabled={running}
          className="mt-8 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running
            ? "Running verification..."
            : "Run Trust Verification"}
        </button>

        {result ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div
              className={`rounded-xl border p-4 ${
                result.passed
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : "border-red-400/30 bg-red-400/10"
              }`}
            >
              <p className="text-sm font-bold">
                {result.passed
                  ? "ALL TRUST TESTS PASSED"
                  : "TRUST TEST FAILED"}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <TrustResult
                label="Unsigned artifact"
                value={
                  result.unsigned
                }
                expected="Unsigned"
              />

              <TrustResult
                label="Signed artifact"
                value={
                  result.signed
                }
                expected="Signed"
              />

              <TrustResult
                label="Verified artifact"
                value={
                  result.verified
                }
                expected="Verified"
              />

              <TrustResult
                label="Modified artifact"
                value={
                  result.invalid
                }
                expected="Invalid"
              />
            </div>
          </section>
        ) : null}
      </div>
      <IntelligenceTrustKeyManager />
    </main>
  );
}

function TrustResult({
  label,
  value,
  expected,
}: {
  label: string;
  value: string;
  expected: string;
}) {
  const passed =
    value === expected;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-zinc-200">
          {label}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          Expected: {expected}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          passed
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-red-400/10 text-red-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}