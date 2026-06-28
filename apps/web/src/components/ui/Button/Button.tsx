import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { ButtonProps } from "./Button.types";

const variantStyles = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700",

  secondary:
    "bg-zinc-800 text-white hover:bg-zinc-700",

  outline:
    "border border-zinc-700 hover:border-blue-500",
};

const sizeStyles = {
  sm: "h-9 px-4 text-sm",

  md: "h-11 px-6",

  lg: "h-14 px-8 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}

      {children}
    </button>
  );
}