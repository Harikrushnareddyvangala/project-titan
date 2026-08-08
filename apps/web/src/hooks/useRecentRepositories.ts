"use client";

import { useSyncExternalStore } from "react";

import {
  getRecentRepositories,
  subscribeToRecentRepositories,
} from "@/lib/github/storage";

/*
 * React requires getServerSnapshot() to return
 * the same cached value between calls.
 *
 * Do NOT use:
 *
 * () => []
 *
 * because that creates a new array every time.
 */
const EMPTY_REPOSITORIES: string[] = [];

let recentRepositoriesSnapshot: string[] | null =
  null;

function getRecentRepositoriesSnapshot(): string[] {
  if (recentRepositoriesSnapshot === null) {
    recentRepositoriesSnapshot =
      getRecentRepositories();
  }

  return recentRepositoriesSnapshot;
}

function subscribe(
  callback: () => void,
): () => void {
  return subscribeToRecentRepositories(
    () => {
      /*
       * Refresh the cached snapshot BEFORE
       * notifying React.
       */
      recentRepositoriesSnapshot =
        getRecentRepositories();

      callback();
    },
  );
}

export function useRecentRepositories(): string[] {
  return useSyncExternalStore(
    subscribe,
    getRecentRepositoriesSnapshot,
    () => EMPTY_REPOSITORIES,
  );
}