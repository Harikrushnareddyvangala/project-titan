"use client";

import {
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import type {
  IntelligenceArtifactTrustAssessment,
} from "@/types/intelligence";

interface IntelligenceArtifactTrustProps {
  assessment:
    IntelligenceArtifactTrustAssessment;

  signerName?: string;

  signerId?: string;

  signedAt?: string;
}

export function IntelligenceArtifactTrust({
  assessment,
  signerName,
  signerId,
  signedAt,
}: IntelligenceArtifactTrustProps) {
  const verified =
    assessment.status ===
    "Verified";

  const invalid =
    assessment.status ===
    "Invalid";

  const signed =
    assessment.status ===
      "Signed" ||
    verified;

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          {verified ? (
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          ) : invalid ? (
            <ShieldAlert className="h-5 w-5 text-red-400" />
          ) : (
            <ShieldQuestion className="h-5 w-5 text-amber-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Trust
          </p>

          <p
            className={[
              "mt-1 text-sm font-semibold",
              verified
                ? "text-emerald-300"
                : invalid
                  ? "text-red-300"
                  : "text-amber-300",
            ].join(" ")}
          >
            {assessment.status ===
            "Verified"
              ? "Verified Artifact"
              : assessment.status ===
                  "Signed"
                ? "Signed — Trust Restricted"
                : assessment.status ===
                    "Invalid"
                  ? "Invalid Artifact"
                  : "Unsigned Artifact"}
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {assessment.reason}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <TrustMetric
              label="Integrity"
              value={
                assessment.integrityVerified
                  ? "Verified"
                  : "Not Verified"
              }
            />

            <TrustMetric
              label="Signature"
              value={
                assessment.signaturePresent
                  ? assessment.signatureVerified
                    ? "Verified"
                    : "Invalid"
                  : "Unsigned"
              }
            />

            <TrustMetric
              label="Trusted Key"
              value={
                assessment.trustedKeyAvailable
                  ? "Available"
                  : "Unavailable"
              }
            />

            <TrustMetric
              label="Policy Decision"
              value={
                assessment.decision
              }
            />
          </div>

          {signed ? (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-zinc-500">
                  Signer
                </p>

                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {signerName ??
                    "Unknown signer"}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Signer ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-zinc-400">
                  {signerId ??
                    "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Algorithm
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  ECDSA P-256 /
                  SHA-256
                </p>
              </div>

              {signedAt ? (
                <div>
                  <p className="text-xs text-zinc-500">
                    Signed At
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {new Date(
                      signedAt,
                    ).toLocaleString(
                      "en-IN",
                      {
                        dateStyle:
                          "medium",
                        timeStyle:
                          "medium",
                        timeZone:
                          "Asia/Kolkata",
                      },
                    )}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <p className="mt-4 text-[11px] text-zinc-600">
            Trust assessment checked{" "}
            {new Date(
              assessment.checkedAt,
            ).toLocaleString(
              "en-IN",
              {
                dateStyle:
                  "medium",
                timeStyle:
                  "medium",
                timeZone:
                  "Asia/Kolkata",
              },
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="text-[11px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-zinc-300">
        {value}
      </p>
    </div>
  );
}