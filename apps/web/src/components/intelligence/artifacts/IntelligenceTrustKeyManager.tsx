"use client";

import {
  useState,
} from "react";

import {
  KeyRound,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  createTitanSigningKey,
  getTitanSigningKeys,
  getTitanTrustedKeys,
  revokeTitanKey,
} from "@/lib/intelligence/keyManagementService";

export function IntelligenceTrustKeyManager() {
  const [
    keys,
    setKeys,
  ] = useState(
    getTitanSigningKeys(),
  );

  const [
    trustedKeys,
    setTrustedKeys,
  ] = useState(
    getTitanTrustedKeys(),
  );

  const [
    generating,
    setGenerating,
  ] = useState(false);

  async function handleGenerate() {
    setGenerating(true);

    try {
      await createTitanSigningKey();

      setKeys(
        getTitanSigningKeys(),
      );

      setTrustedKeys(
        getTitanTrustedKeys(),
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleRevoke(
    keyId: string,
  ) {
    revokeTitanKey(
      keyId,
    );

    setKeys(
      getTitanSigningKeys(),
    );

    setTrustedKeys(
      getTitanTrustedKeys(),
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Trust Infrastructure
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Signing Keys
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Manage TITAN signing identities and
            trusted public keys.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />

          {generating
            ? "Generating..."
            : "Generate Signing Key"}
        </button>
      </div>

      {keys.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center">
          <KeyRound className="mx-auto h-6 w-6 text-zinc-600" />

          <p className="mt-3 text-sm font-medium text-zinc-400">
            No runtime signing keys.
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Generate a key to begin signing artifacts.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {keys.map(
            (key) => {
              const trusted =
                trustedKeys.some(
                  (trustedKey) =>
                    trustedKey.keyId ===
                    key.keyId,
                );

              return (
                <div
                  key={key.keyId}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
                      <KeyRound className="h-4 w-4 text-cyan-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white">
                          {key.signerName}
                        </p>

                        {trusted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                            <ShieldCheck className="h-3 w-3" />
                            Trusted
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 break-all font-mono text-xs text-zinc-500">
                        {key.keyId}
                      </p>

                      <p className="mt-2 text-xs text-zinc-600">
                        ECDSA P-256 / SHA-256
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Created{" "}
                        {new Date(
                          key.createdAt,
                        ).toLocaleString(
                          "en-IN",
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                            timeZone:
                              "Asia/Kolkata",
                          },
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRevoke(
                          key.keyId,
                        )
                      }
                      className="rounded-lg border border-red-400/20 p-2 text-red-400 transition hover:bg-red-400/10"
                      aria-label={`Revoke ${key.keyId}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}