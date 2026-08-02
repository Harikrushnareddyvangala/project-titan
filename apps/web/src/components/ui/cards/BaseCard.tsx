import type { ReactNode } from "react";

export type CardVariant =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "danger";

export type CardPadding =
  | "sm"
  | "md"
  | "lg";

interface BaseCardProps {
  children: ReactNode;

  title?: string;

  subtitle?: string;

  headerAction?: ReactNode;

  footer?: ReactNode;

  variant?: CardVariant;

  padding?: CardPadding;

  hover?: boolean;

  className?: string;
}

const CARD_VARIANTS: Record<
  CardVariant,
  string
> = {

  default:
    "border-white/10 bg-black/30",

  success:
    "border-emerald-500/30 bg-emerald-500/5",

  info:
    "border-cyan-500/30 bg-cyan-500/5",

  warning:
    "border-amber-500/30 bg-amber-500/5",

  danger:
    "border-red-500/30 bg-red-500/5",

};

const CARD_PADDING: Record<
  CardPadding,
  string
> = {

  sm: "p-4",

  md: "p-6",

  lg: "p-8",

};

export function BaseCard({

  children,

  title,

  subtitle,

  headerAction,

  footer,

  variant = "default",

  padding = "md",

  hover = true,

  className = "",

}: BaseCardProps) {

  return (

    <div
      className={`
        rounded-2xl
        border
        backdrop-blur-xl
        transition-all
        duration-300

        ${CARD_VARIANTS[variant]}

        ${CARD_PADDING[padding]}

        ${
          hover
            ? "hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
            : ""
        }

        ${className}
      `}
    >

      {(title || subtitle || headerAction) && (

        <div className="mb-6 flex items-start justify-between">

          <div>

            {title && (

              <h3 className="text-lg font-semibold text-white">

                {title}

              </h3>

            )}

            {subtitle && (

              <p className="mt-1 text-sm text-zinc-400">

                {subtitle}

              </p>

            )}

          </div>

          {headerAction}

        </div>

      )}

      <div>

        {children}

      </div>

      {footer && (

        <div className="mt-6">

          {footer}

        </div>

      )}

    </div>

  );

}