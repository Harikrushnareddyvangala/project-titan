"use client";

import {
  useState,
} from "react";

import {
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Plus,
} from "lucide-react";

import type {
  IntelligenceArtifact,
} from "@/types/intelligence";

import {
  getIntelligenceSigningKeys,
} from "@/lib/intelligence/keyManager";

import {
  createTitanSigningKey,
} from "@/lib/intelligence/keyManagementService";

import {
  signRegisteredArtifact,
} from "@/lib/intelligence/artifactSigningWorkflow";

import {
  getArtifactTrustStatus,
} from "@/lib/intelligence/trustService";

interface IntelligenceArtifactSigningPanelProps {
  artifact: IntelligenceArtifact;

  onSigned?: (
    artifact: IntelligenceArtifact,
  ) => void;
}

export function IntelligenceArtifactSigningPanel({
  artifact,
  onSigned,
}: IntelligenceArtifactSigningPanelProps) {
  const [
    keys,
    setKeys,
  ] = useState(
    () =>
      getIntelligenceSigningKeys(),
  );

  const [
    selectedKeyId,
    setSelectedKeyId,
  ] = useState(
    keys[0]?.keyId ?? "",
  );

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    signing,
    setSigning,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    verificationStatus,
    setVerificationStatus,
  ] = useState<
    string | null
  >(null);

  /* ------------------------------------------------------------------------ */
  /*                         Refresh Keys                                    */
  /* ------------------------------------------------------------------------ */

  function refreshKeys() {
    const nextKeys =
      getIntelligenceSigningKeys();

    setKeys(
      nextKeys,
    );

    if (
      nextKeys.length > 0 &&
      !nextKeys.some(
        (key) =>
          key.keyId ===
          selectedKeyId,
      )
    ) {
      setSelectedKeyId(
        nextKeys[0].keyId,
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                         Generate Key                                    */
  /* ------------------------------------------------------------------------ */

  async function handleGenerateKey() {
    setError(null);
    setGenerating(true);

    try {
      const key =
        await createTitanSigningKey();

      const nextKeys =
        getIntelligenceSigningKeys();

      setKeys(
        nextKeys,
      );

      setSelectedKeyId(
        key.keyId,
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to generate signing key.",
      );
    } finally {
      setGenerating(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                         Sign Artifact                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSign() {
    setError(null);
    setSuccess(false);
    setVerificationStatus(
      null,
    );

    if (!selectedKeyId) {
      setError(
        "Select a signing key before signing the artifact.",
      );

      return;
    }

    setSigning(true);

    try {
      const result =
        await signRegisteredArtifact(
          artifact.artifactId,
          selectedKeyId,
        );

      const trustStatus =
        await getArtifactTrustStatus(
          result.artifact,
        );

      setVerificationStatus(
        trustStatus,
      );

      setSuccess(
        trustStatus ===
          "Verified",
      );

      onSigned?.(
        result.artifact,
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Artifact signing failed.",
      );
    } finally {
      setSigning(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                         Already Signed                                  */
  /* ------------------------------------------------------------------------ */

  if (artifact.signature) {
    return (
      <section className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Artifact Trust
            </p>

            <h4 className="mt-1 text-sm font-bold text-white">
              Artifact is digitally signed
            </h4>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Signer:{" "}
              {artifact.signature.signerName}
            </p>

            <p className="mt-1 break-all font-mono text-[11px] text-zinc-600">
              Key ID:{" "}
              {artifact.signature.keyId ??
                "legacy-signature"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                         Signing UI                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <LockKeyhole className="h-5 w-5 text-cyan-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Artifact Trust
          </p>

          <h4 className="mt-1 text-sm font-bold text-white">
            Sign this artifact
          </h4>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Apply a cryptographic signature using
            a TITAN runtime signing key.
          </p>

          {/* ---------------------------------------------------------------- */}
          {/*                         No Keys                                 */}
          {/* ---------------------------------------------------------------- */}

          {keys.length === 0 ? (
            <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
              <div className="flex items-start gap-3">
                <KeyRound className="mt-0.5 h-4 w-4 text-amber-400" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-300">
                    No signing key available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Generate a signing key in this
                    browser session before signing
                    this artifact.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={
                        handleGenerateKey
                      }
                      disabled={
                        generating
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />

                      {generating
                        ? "Generating..."
                        : "Generate Signing Key"}
                    </button>

                    <button
                      type="button"
                      onClick={
                        refreshKeys
                      }
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.05]"
                    >
                      Refresh Keys
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ------------------------------------------------------------ */}
              {/*                         Key Selector                        */}
              {/* ------------------------------------------------------------ */}

              <label
                htmlFor={`artifact-signing-key-${artifact.artifactId}`}
                className="mt-5 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Signing Key
              </label>

              <select
                id={`artifact-signing-key-${artifact.artifactId}`}
                value={
                  selectedKeyId
                }
                onChange={(
                  event,
                ) =>
                  setSelectedKeyId(
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-zinc-200 outline-none transition focus:border-cyan-400/40"
              >
                {keys.map(
                  (key) => (
                    <option
                      key={
                        key.keyId
                      }
                      value={
                        key.keyId
                      }
                    >
                      {key.signerName}{" "}
                      —{" "}
                      {key.keyId}
                    </option>
                  ),
                )}
              </select>

              {/* ------------------------------------------------------------ */}
              {/*                         Sign                                */}
              {/* ------------------------------------------------------------ */}

              <button
                type="button"
                onClick={
                  handleSign
                }
                disabled={
                  signing
                }
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LockKeyhole className="h-4 w-4" />

                {signing
                  ? "Signing..."
                  : "Sign Artifact"}
              </button>
            </>
          )}

          {/* ---------------------------------------------------------------- */}
          {/*                         Success                                 */}
          {/* ---------------------------------------------------------------- */}

          {success ? (
            <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3">
              <p className="text-sm font-semibold text-emerald-300">
                Artifact signed and verified.
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Trust status:{" "}
                {verificationStatus}
              </p>
            </div>
          ) : null}

          {/* ---------------------------------------------------------------- */}
          {/*                         Error                                   */}
          {/* ---------------------------------------------------------------- */}

          {error ? (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-3">
              <p className="text-sm font-semibold text-red-300">
                Signing operation failed
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                {error}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}