"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
          "bg-zinc-800 text-white hover:bg-zinc-700",

        outline:
          "border border-zinc-700 bg-transparent hover:bg-zinc-900",

        ghost:
          "hover:bg-zinc-900",

        destructive:
          "bg-red-600 text-white hover:bg-red-700",

        link:
          "underline-offset-4 hover:underline",
      },

      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
        xl: "h-14 px-8",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
  return (
    <Slot
      className={cn(
        buttonVariants({ variant, size }),
        className,
      )}
      {...props}
    >
      {children}
    </Slot>
  );
}

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };