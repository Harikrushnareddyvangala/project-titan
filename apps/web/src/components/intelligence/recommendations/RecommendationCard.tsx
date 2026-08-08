interface RecommendationCardProps {
  recommendation: {
    title: string;
    description: string;
  };
  index: number;
}

export function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.05]">
      <div className="flex gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-300">
          {index + 1}
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {recommendation.title}
          </h3>

          <p className="mt-2 text-sm leading-7 text-zinc-400">
            {recommendation.description}
          </p>
        </div>
      </div>
    </div>
  );
}