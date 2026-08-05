import { ExecutiveCard } from "@/components/ui";

interface ExecutiveSummaryProps {

  title: string;

  summary: string;

}

export function ExecutiveSummary({

  title,

  summary,

}: ExecutiveSummaryProps) {

  return (

    <ExecutiveCard

      title={title}

      summary={summary}

    />

  );

}