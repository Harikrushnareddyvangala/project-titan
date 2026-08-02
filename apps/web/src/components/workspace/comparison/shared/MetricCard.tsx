interface MetricCardProps {
  title: string;
  value: string | number;
}

export function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-5">

      <div className="text-sm uppercase tracking-wider text-zinc-500">
        {title}
      </div>

      <div className="mt-3 text-3xl font-bold text-white">
        {value}
      </div>

    </div>
  );
}