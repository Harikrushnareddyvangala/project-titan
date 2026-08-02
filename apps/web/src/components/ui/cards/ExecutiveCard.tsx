import { BaseCard } from "./BaseCard";

interface ExecutiveCardProps {

  title: string;

  summary: string;

  recommendation?: string;

}

export function ExecutiveCard({

  title,

  summary,

  recommendation,

}: ExecutiveCardProps) {

  return (

    <BaseCard
      title="Executive Insight"
      variant="info"
    >

      <h4 className="text-lg font-semibold">

        {title}

      </h4>

      <p className="mt-3 text-zinc-300">

        {summary}

      </p>

      {recommendation && (

        <div className="mt-6 rounded-lg bg-cyan-500/10 p-4">

          <div className="text-sm font-semibold text-cyan-300">

            Recommendation

          </div>

          <p className="mt-2 text-sm">

            {recommendation}

          </p>

        </div>

      )}

    </BaseCard>

  );

}