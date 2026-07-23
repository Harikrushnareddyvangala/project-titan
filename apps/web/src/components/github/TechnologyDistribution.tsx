"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repositories: RepositoryAnalytics[];
}

const COLORS = [
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export function TechnologyDistribution({
  repositories,
}: Props) {

  const frontendMap = new Map<string, number>();

  repositories.forEach((repo) => {

    const current =
      frontendMap.get(repo.frontend) ?? 0;

    frontendMap.set(
      repo.frontend,
      current + 1,
    );

  });

  const data = Array.from(
    frontendMap.entries(),
  ).map(([name, value]) => ({
    name,
    value,
  }));

  return (

    <section
      className="
      rounded-[32px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      h-[520px]
      "
    >

      <h3
        className="
        text-2xl
        font-bold
        text-white
        "
      >

        Frontend Technology Distribution

      </h3>

      <div className="h-[420px] mt-8">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
            >

              {data.map(
                (_, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                        COLORS.length
                      ]
                    }
                  />

                ),
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </section>

  );

}