import {
  TITAN_COLORS,
} from "@/components/ui";

interface ScoreIndicatorProps {
  score: number;
}

export function ScoreIndicator({
  score,
}: ScoreIndicatorProps) {

  const color =
    score >= 90
      ? TITAN_COLORS.success
      : score >= 75
      ? TITAN_COLORS.info
      : score >= 60
      ? TITAN_COLORS.warning
      : TITAN_COLORS.danger;

  return (

    <span
      className={`font-bold ${color}`}
    >

      {score.toFixed(1)}%

    </span>

  );

}