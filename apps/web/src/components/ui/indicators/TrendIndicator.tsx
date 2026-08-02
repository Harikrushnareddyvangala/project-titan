import {
  Minus,
  TrendingDown,
  TrendingUp,
} from "@/components/ui";

import {
  TITAN_COLORS,
} from "@/components/ui";

interface TrendIndicatorProps {
  value: number;

  suffix?: string;

  precision?: number;
}

export function TrendIndicator({
  value,
  suffix = "",
  precision = 1,
}: TrendIndicatorProps) {

  const Icon =
    value > 0
      ? TrendingUp
      : value < 0
      ? TrendingDown
      : Minus;

  const color =
    value > 0
      ? TITAN_COLORS.success
      : value < 0
      ? TITAN_COLORS.danger
      : TITAN_COLORS.neutral;

  return (

    <div
      className={`flex items-center gap-2 ${color}`}
    >

      <Icon className="h-4 w-4" />

      <span className="font-semibold">

        {value > 0 ? "+" : ""}
        {value.toFixed(precision)}
        {suffix}

      </span>

    </div>

  );

}