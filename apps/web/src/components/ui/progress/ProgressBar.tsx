
import {
  TITAN_BACKGROUNDS,
  TITAN_BORDERS,
} from "../theme";

type ProgressColor = keyof typeof TITAN_BACKGROUNDS;

interface ProgressBarProps {
  value: number;

  max?: number;

  color?:
    ProgressColor;
  height?: "sm" | "md" | "lg";

  showLabel?: boolean;

  precision?: number;
}



export function ProgressBar({
  value,
  max = 100,
  color = "info",
  height = "md",
  showLabel = true,
  precision = 1,
}: ProgressBarProps) {

  const percentage = Math.max(
    0,
    Math.min(
      100,
      (value / max) * 100,
    ),
  );

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (

    <div className="space-y-2">

      {showLabel && (

        <div className="text-sm font-semibold text-zinc-300">

          {value.toFixed(precision)}%

        </div>

      )}

      <div
        className={`
          w-full
          overflow-hidden
          rounded-full
          bg-zinc-800
          ${heights[height]}
        `}
      >

        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-700
            ${TITAN_BACKGROUNDS[color]}
            ${TITAN_BORDERS[color]}
            border
          `}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );

}