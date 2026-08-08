interface ExecutiveSummaryProps {
  summary: string;
  strengths: string[];
  risks: string[];
}

export function ExecutiveSummary({
  summary,
  strengths,
  risks,
}: ExecutiveSummaryProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Executive Summary
        </p>

        <p className="mt-4 max-w-5xl text-lg leading-8 text-zinc-300">
          {summary}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-semibold text-white">
          Strengths
        </h3>

        {strengths.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {strengths.map((strength) => (
              <li
                key={strength}
                className="text-sm leading-6 text-zinc-400"
              >
                {strength}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            No strengths identified.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-semibold text-white">
          Risks
        </h3>

        {risks.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {risks.map((risk) => (
              <li
                key={risk}
                className="text-sm leading-6 text-zinc-400"
              >
                {risk}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            No significant risks identified.
          </p>
        )}
      </div>
    </div>
  );
}