"use client";

import { useEffect } from "react";

import { initializePlatform } from "@/lib/platform/initializePlatform";

interface PlatformProviderProps {
  children: React.ReactNode;
}

export function PlatformProvider({
  children,
}: PlatformProviderProps) {
  useEffect(() => {
    initializePlatform();
  }, []);

  return <>{children}</>;
}