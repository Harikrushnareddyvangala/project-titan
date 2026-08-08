interface DevelopmentMetricCardProps {
  label: string;
  value: string | number;
  description?: string;
}

export function DevelopmentMetricCard({
  label,
  value,
  description,
}: DevelopmentMetricCardProps) {
  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "—"
      : value;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.05]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>

      <p className="mt-3 break-words text-2xl font-black text-white">
        {displayValue}
      </p>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}