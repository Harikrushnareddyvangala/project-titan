"use client";

import { motion } from "framer-motion";
import type { RepositoryAnalytics } from "@/types/github";

import { BenchmarkCard } from "./BenchmarkCard";
import { BenchmarkSummary } from "./BenchmarkSummary";
import { BenchmarkMetricsGrid } from "./BenchmarkMetricsGrid";
import { BenchmarkRadarChart } from "./BenchmarkRadarChart";
import { BenchmarkComparisonChart } from "./BenchmarkComparisonChart";
import { BenchmarkTrendChart } from "./BenchmarkTrendChart";

interface RepositoryBenchmarkProps {
  analytics: RepositoryAnalytics | null;
}

export function RepositoryBenchmark({
  analytics,
}: RepositoryBenchmarkProps) {
  if (!analytics) {
    return null;
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
      mt-10
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-br
      from-zinc-900/90
      via-zinc-950
      to-black
      p-8
      backdrop-blur-xl
      shadow-[0_0_60px_rgba(34,211,238,0.08)]
      "
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2
            className="
            text-3xl
            font-bold
            text-white
            "
          >
            Enterprise Repository Benchmark
          </h2>

          <p
            className="
            mt-2
            max-w-3xl
            text-zinc-400
            "
          >
            Compare this repository against enterprise engineering
            standards across software quality, DevOps maturity,
            security posture and production readiness.
          </p>
        </div>

        <div
          className="
          rounded-full
          border
          border-cyan-400/20
          bg-cyan-500/10
          px-4
          py-2
          text-sm
          font-semibold
          text-cyan-300
          "
        >
          Enterprise Intelligence
        </div>
      </div>

      <BenchmarkSummary analytics={analytics} />

      <BenchmarkMetricsGrid
  analytics={analytics}
/>

<BenchmarkRadarChart
  analytics={analytics}
/>
<BenchmarkComparisonChart
  analytics={analytics}
/>
<BenchmarkTrendChart
  analytics={analytics}
/>

      <div
        className="
        mt-10
        grid
        gap-6
        lg:grid-cols-2
        "
      >
        <BenchmarkCard
          title="Engineering"
          score={analytics.engineeringScore}
          benchmark={analytics.benchmarkEngineering}
          gap={analytics.engineeringGap}
        />

        <BenchmarkCard
          title="Security"
          score={analytics.securityScore}
          benchmark={analytics.benchmarkSecurity}
          gap={analytics.securityGap}
        />

        <BenchmarkCard
          title="DevOps"
          score={analytics.devopsScore}
          benchmark={analytics.benchmarkDevOps}
          gap={analytics.devopsGap}
        />

        <BenchmarkCard
          title="Code Quality"
          score={analytics.codeQuality}
          benchmark={analytics.benchmarkCodeQuality}
          gap={analytics.codeQualityGap}
        />

        <BenchmarkCard
          title="Enterprise Readiness"
          score={analytics.enterpriseReadiness}
          benchmark={analytics.benchmarkEnterprise}
          gap={analytics.enterpriseGap}
        />

        <BenchmarkCard
          title="Overall Benchmark"
          score={analytics.overallBenchmarkScore}
          benchmark={85}
          gap={analytics.overallBenchmarkScore - 85}
        />
      </div>
    </motion.section>
  );
}