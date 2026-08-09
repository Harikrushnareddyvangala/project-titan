"use client";

import { useSyncExternalStore } from "react";

import type { IntelligenceSnapshot } from "@/types/intelligence";

import {
  decodeSnapshot,
} from "@/lib/intelligence/share";

const SNAPSHOT_PARAMETER =
  "snapshot";

const NO_SHARED_SNAPSHOT:
  | IntelligenceSnapshot
  | null = null;

let cachedSearch: string | null = null;

let cachedSnapshot:
  | IntelligenceSnapshot
  | null = null;

function getSharedSnapshot(): IntelligenceSnapshot | null {
  if (typeof window === "undefined") {
    return NO_SHARED_SNAPSHOT;
  }

  const search =
    window.location.search;

  if (search === cachedSearch) {
    return cachedSnapshot;
  }

  cachedSearch = search;

  const encoded =
    new URLSearchParams(
      search,
    ).get(SNAPSHOT_PARAMETER);

  cachedSnapshot = encoded
    ? decodeSnapshot(encoded)
    : null;

  return cachedSnapshot;
}

function subscribe(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleNavigation = () => {
    /*
     * Force the next snapshot read to use
     * the current URL.
     */
    cachedSearch = null;
    cachedSnapshot = null;

    callback();
  };

  window.addEventListener(
    "popstate",
    handleNavigation,
  );

  return () => {
    window.removeEventListener(
      "popstate",
      handleNavigation,
    );
  };
}

export function useSharedSnapshot():
  | IntelligenceSnapshot
  | null {
  return useSyncExternalStore(
    subscribe,
    getSharedSnapshot,
    () => NO_SHARED_SNAPSHOT,
  );
}