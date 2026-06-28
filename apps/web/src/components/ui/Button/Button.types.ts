import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { buttonVariants } from "./Button.styles";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}