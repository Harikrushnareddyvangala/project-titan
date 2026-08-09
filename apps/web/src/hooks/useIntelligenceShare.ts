"use client";

import { useState } from "react";

import type { IntelligenceSnapshot } from "@/types/intelligence";

import {
  createSnapshotShareUrl,
} from "@/lib/intelligence/share";

export function useIntelligenceShare() {
  const [
    shared,
    setShared,
  ] = useState(false);

  const shareSnapshot = async (
    snapshot: IntelligenceSnapshot,
  ) => {
    const url =
      createSnapshotShareUrl(
        snapshot,
      );

    if (!url) {
      return;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          url,
        );
      } else {
        const textarea =
          document.createElement(
            "textarea",
          );

        textarea.value = url;
        textarea.style.position =
          "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(
          textarea,
        );

        textarea.focus();
        textarea.select();

        document.execCommand(
          "copy",
        );

        textarea.remove();
      }

      setShared(true);

      window.setTimeout(() => {
        setShared(false);
      }, 2000);
    } catch {
      setShared(false);
    }
  };

  return {
    shareSnapshot,
    shared,
  };
}