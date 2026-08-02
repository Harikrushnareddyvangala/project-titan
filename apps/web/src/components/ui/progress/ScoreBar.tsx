import {
  ProgressBar,
} from "./ProgressBar";

interface ScoreBarProps {
  score: number;
}

export function ScoreBar({
  score,
}: ScoreBarProps) {

  const color =
    score >= 90
      ? "success"
      : score >= 75
      ? "info"
      : score >= 60
      ? "warning"
      : "danger";

  return (

    <ProgressBar
      value={score}
      color={color}
    />

  );

}