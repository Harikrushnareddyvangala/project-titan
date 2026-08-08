interface EngineeringMetricCardProps {
  label: string;
  value: string | number;
  description?: string;
}

export function EngineeringMetricCard({
  label,
  value,
  description,
}: EngineeringMetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.05]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}