import { MetricCard } from "@/components/ui";

interface ConfidenceMetricProps {

  title?: string;

  confidence: number;

}

export function ConfidenceMetric({

  title = "Confidence",

  confidence,

}: ConfidenceMetricProps) {

  return (

    <MetricCard

      title={title}

      value={confidence}

      suffix="%"

      precision={1}

    />

  );

}