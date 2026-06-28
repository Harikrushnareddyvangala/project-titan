import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-xl",
    "font-medium",
    "transition-all",
    "duration-200",
    "select-none",
    "whitespace-nowrap",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-500",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
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
        sm: "h-9 px-3 text-sm",

        md: "h-10 px-4",

        lg: "h-12 px-6 text-base",

        xl: "h-14 px-8 text-lg",

        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);