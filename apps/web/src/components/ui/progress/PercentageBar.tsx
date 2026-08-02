import {
  ProgressBar,
} from "./ProgressBar";

interface PercentageBarProps {
  percentage: number;
}

export function PercentageBar({
  percentage,
}: PercentageBarProps) {

  return (

    <ProgressBar
      value={percentage}
      color="neutral"
    />

  );

}