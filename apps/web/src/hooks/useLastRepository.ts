"use client";

import { useSyncExternalStore } from "react";

import {
  getLastRepository,
  subscribeToRepositoryStorage,
} from "@/lib/github/storage";

import { DEFAULT_REPOSITORY } from "@/lib/constants/github";

export function useLastRepository(): string {
  return useSyncExternalStore(
    subscribeToRepositoryStorage,
    () =>
      getLastRepository() ??
      DEFAULT_REPOSITORY,
    () => DEFAULT_REPOSITORY,
  );
}