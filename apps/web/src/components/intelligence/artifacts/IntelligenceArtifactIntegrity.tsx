"use client";

import {
  CheckCircle2,
  Fingerprint,
  ShieldAlert,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  fingerprintIntelligenceArtifact,
  verifyIntelligenceArtifact,
} from "@/lib/intelligence/artifactRegistry";

interface IntelligenceArtifactIntegrityProps {
  artifactId: string;
  hasIntegrity: boolean;
  hash?: string;
}

export function IntelligenceArtifactIntegrity({
  artifactId,
  hasIntegrity,
  hash,
}: IntelligenceArtifactIntegrityProps) {
  const [
    verifying,
    setVerifying,
  ] = useState(false);

  const [
    result,
    setResult,
  ] = useState<
    boolean | null
  >(null);

  async function handleFingerprint() {
    setVerifying(true);

    try {
      await fingerprintIntelligenceArtifact(
        artifactId,
      );

      setResult(true);
    } finally {
      setVerifying(false);
    }
  }

  async function handleVerify() {
    setVerifying(true);

    try {
      const valid =
        await verifyIntelligenceArtifact(
          artifactId,
        );

      setResult(valid);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <Fingerprint className="h-5 w-5 text-cyan-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Integrity
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            Artifact Fingerprint
          </p>

          {hash ? (
            <p className="mt-2 break-all font-mono text-[11px] leading-5 text-zinc-500">
              SHA-256: {hash}
            </p>
          ) : (
            <p className="mt-2 text-xs text-zinc-500">
              This artifact has not been fingerprinted yet.
            </p>
          )}

          {result !== null ? (
            <div className="mt-3 flex items-center gap-2 text-xs">
              {result ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                  <span className="text-emerald-400">
                    Integrity verified
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 text-red-400" />

                  <span className="text-red-400">
                    Integrity verification failed
                  </span>
                </>
              )}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {!hasIntegrity ? (
              <button
                type="button"
                disabled={verifying}
                onClick={
                  handleFingerprint
                }
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/[0.1] disabled:opacity-50"
              >
                {verifying
                  ? "Fingerprinting..."
                  : "Generate Fingerprint"}
              </button>
            ) : (
              <button
                type="button"
                disabled={verifying}
                onClick={
                  handleVerify
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:text-white disabled:opacity-50"
              >
                {verifying
                  ? "Verifying..."
                  : "Verify Integrity"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}