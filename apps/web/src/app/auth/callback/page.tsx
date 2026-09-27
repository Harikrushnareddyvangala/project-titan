"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import { completeBrowserLogin } from "@/lib/auth/callback-flow";

function getCallbackParams(): {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
} {
  const params = new URLSearchParams(window.location.search);

  return {
    code: params.get("code") ?? undefined,
    state: params.get("state") ?? undefined,
    error: params.get("error") ?? undefined,
    error_description: params.get("error_description") ?? undefined,
  };
}

export default function AuthCallbackPage() {
  const { setSession } = useAuth();
  const router = useRouter();
  const startedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    void completeBrowserLogin(getCallbackParams())
      .then(({ session }) => {
        setSession(session);
        router.replace("/");
      })
      .catch((callbackError: unknown) => {
        setError(
          callbackError instanceof Error
            ? callbackError.message
            : "Authentication callback failed.",
        );
      });
  }, [router, setSession]);

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <section className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-white">
          <h1 className="text-xl font-semibold">
            Authentication failed
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            {error}
          </p>

          <a
            href="/auth/login"
            className="mt-6 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Return to sign in
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
      <p className="text-sm text-zinc-400">
        Completing authentication…
      </p>
    </main>
  );
}
