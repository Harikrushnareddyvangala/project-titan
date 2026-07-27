"use client";

interface MetricCardProps {
  title: string;
  value: string;
}

export function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <p className="text-center text-sm uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>

      <p className="mt-5 text-center text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}