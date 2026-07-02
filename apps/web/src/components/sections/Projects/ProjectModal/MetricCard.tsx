"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { MetricRing } from "./MetricRing";
import CountUp from "react-countup";

interface MetricCardProps {
  title: string;
  description: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
}

export function MetricCard({
  title,
  description,
  value,
  trend = 0,
  icon: Icon,
}: MetricCardProps) {
  const trendColor =
    trend > 0
      ? "text-emerald-400"
      : trend < 0
      ? "text-red-400"
      : "text-zinc-400";

  const trendText =
    trend > 0
      ? `▲ +${trend}%`
      : trend < 0
      ? `▼ ${trend}%`
      : "Stable";

  return (
    <motion.div
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
      whileHover={{
  y: -10,
  scale: 1.03,
}}
      transition={{
        duration: .4,
      }}
      className="
group
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-gradient-to-br
from-white/[0.05]
to-white/[0.02]
p-8
backdrop-blur-2xl
transition-all
duration-500
hover:border-cyan-400/50
"
    >
      <div
  className="
    absolute
    inset-0
    bg-gradient-to-br
    from-cyan-500/5
    via-transparent
    to-blue-500/5
    opacity-0
    transition-opacity
    duration-500
    group-hover:opacity-100
  "
/>
<div className="relative z-10">
      <div className="mb-6 flex items-center justify-between">

        <Icon
          className="
            h-8
            w-8
            text-cyan-400
          "
        />

        <span
          className={`text-sm font-semibold ${trendColor}`}
        >
          {trendText}
        </span>

      </div>
      

      <div className="relative flex justify-center">

  <MetricRing
    value={value}
    label=""
    size={120}
  />

  <div
    className="
      absolute
      inset-0
      flex
      items-center
      justify-center
      flex-col
    "
  >
    <span
      className="
        text-4xl
        font-bold
        text-white
      "
    >
      <CountUp
        end={value}
        duration={2}
      />
    </span>

    <span
      className="
        text-xs
        uppercase
        tracking-widest
        text-zinc-500
      "
    >
      KPI
    </span>

  </div>

</div>

      <h3
        className="
    mt-8
    text-xl
    font-semibold
    tracking-tight
    text-white
  "
      >
        {title}
      </h3>

      <p
        className="
    mt-3
    leading-7
    text-zinc-400
  "
      >
        {description}
      </p>
</div>
    </motion.div>
  );
}