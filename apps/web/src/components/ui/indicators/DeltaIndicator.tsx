interface DeltaIndicatorProps {
  current: number;

  previous: number;

  suffix?: string;
}

import {
  TrendIndicator,
} from "./TrendIndicator";

export function DeltaIndicator({
  current,
  previous,
  suffix = "",
}: DeltaIndicatorProps) {

  return (

    <TrendIndicator
      value={current - previous}
      suffix={suffix}
    />

  );

}