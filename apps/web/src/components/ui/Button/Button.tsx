"use client";

import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

import { buttonVariants } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {children}
    </Component>
  );
}