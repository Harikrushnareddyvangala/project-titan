"use client";

import type {
  ExecutiveSummary,
} from "@/types/github";

interface Props {

  summary: ExecutiveSummary;

}

export function ExecutiveSummaryCard({

  summary,

}: Props) {

  return (

    <section
      className="
      rounded-[32px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >

      <h2
        className="
        text-2xl
        font-bold
        text-white
        "
      >

        {summary.headline}

      </h2>

      <p
        className="
        mt-5
        text-zinc-300
        "
      >

        {summary.summary}

      </p>

      <div className="mt-8">

        <h4 className="font-semibold text-cyan-400">

          Strengths

        </h4>

        <ul className="mt-3 list-disc ml-6 space-y-2">

          {summary.strengths.map(

            (item) => (

              <li key={item}>

                {item}

              </li>

            ),

          )}

        </ul>

      </div>

      <div className="mt-8">

        <h4 className="font-semibold text-orange-400">

          Improvement Opportunities

        </h4>

        <ul className="mt-3 list-disc ml-6 space-y-2">

          {summary.improvements.map(

            (item) => (

              <li key={item}>

                {item}

              </li>

            ),

          )}

        </ul>

      </div>

      <div
        className="
        mt-8
        rounded-2xl
        bg-cyan-500/10
        p-5
        "
      >

        <h4 className="font-semibold text-cyan-300">

          AI Recommendation

        </h4>

        <p className="mt-3">

          {summary.recommendation}

        </p>

      </div>

    </section>

  );

}