import {
  ProgressBar,
} from "./ProgressBar";

interface ConfidenceBarProps {
  confidence: number;
}

export function ConfidenceBar({
  confidence,
}: ConfidenceBarProps) {

  return (

    <ProgressBar
      value={confidence}
      color="info"
    />

  );

}