"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repository: RepositoryAnalytics;
}

export function EngineeringRadar({
  repository,
}: Props) {

  const data = [

    {
      subject: "Engineering",
      score: repository.engineeringScore,
    },

    {
      subject: "Security",
      score: repository.securityScore,
    },

    {
      subject: "DevOps",
      score: repository.devopsScore,
    },

    {
      subject: "Code",
      score: repository.codeQuality,
    },

    {
      subject: "Enterprise",
      score: repository.enterpriseReadiness,
    },

    {
      subject: "Team",
      score: repository.teamHealth,
    },

  ];

  return (

    <div
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

        Engineering Capability Radar

      </h3>

      <div className="mt-10 h-[420px]">

        <ResponsiveContainer>

          <RadarChart data={data}>

            <PolarGrid />

            <PolarAngleAxis
              dataKey="subject"
            />

            <PolarRadiusAxis
              domain={[0,100]}
            />

            <Radar

              dataKey="score"

              stroke="#22d3ee"

              fill="#22d3ee"

              fillOpacity={0.35}

            />

          </RadarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}