"use client";

import { motion } from "framer-motion";

import {
  Zap,
  Cpu,
  Gauge,
  TimerReset,
  Rocket,
} from "lucide-react";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}

export function RepositoryPerformanceAnalysis({
  repository,
  analytics,
}: Props) {

  const engineering =
    analytics?.engineeringScore ?? 0;

  const production =
    analytics?.productionScore ?? 0;

  const health =
    analytics?.healthScore ?? 0;

  const performance =
    Math.round(
      engineering * 0.40 +
      production * 0.35 +
      health * 0.25
    );

  const scalability =
    Math.round(
      (engineering + production) / 2
    );

  const optimization =
    Math.min(
      100,
      performance + 5
    );

  const runtime =
    Math.round(
      (performance + health) / 2
    );

  const build =
    Math.round(
      (production + performance) / 2
    );

  return (

<motion.section
id = "performance"
initial={{opacity:0,y:25}}
whileInView={{opacity:1,y:0}}
viewport={{once:true}}
className="
rounded-[34px]
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-8
"
>

<div className="flex items-center gap-3">

<Zap
className="text-cyan-400"
size={28}
/>

<div>

<h2 className="text-2xl font-bold text-white">
AI Performance Intelligence
</h2>

<p className="text-zinc-400">
Performance and optimization analysis
</p>

</div>

</div>

<div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

<Metric
icon={<Gauge size={20}/>}
title="Performance"
value={`${performance}%`}
/>

<Metric
icon={<Rocket size={20}/>}
title="Scalability"
value={`${scalability}%`}
/>

<Metric
icon={<Cpu size={20}/>}
title="Optimization"
value={`${optimization}%`}
/>

<Metric
icon={<TimerReset size={20}/>}
title="Runtime"
value={`${runtime}%`}
/>

<Metric
icon={<Zap size={20}/>}
title="Build"
value={`${build}%`}
/>

</div>

<motion.div
whileHover={{
scale:1.01,
}}
className="
mt-10
rounded-3xl
border
border-cyan-400/20
bg-cyan-500/10
p-6
"
>

<h3 className="text-lg font-semibold text-white">
AI Performance Assessment
</h3>

<p className="mt-5 leading-8 text-zinc-300">

TITAN estimates this repository achieves

<span className="ml-2 font-semibold text-cyan-300">
{performance}% performance maturity.
</span>

<br /><br />

Optimization:
<span className="ml-2 text-cyan-300">
{optimization}%
</span>

<br />

Scalability:
<span className="ml-2 text-cyan-300">
{scalability}%
</span>

<br />

Runtime Efficiency:
<span className="ml-2 text-cyan-300">
{runtime}%
</span>

<br />

Build Optimization:
<span className="ml-2 text-cyan-300">
{build}%
</span>

</p>

</motion.div>

</motion.section>

  );

}

function Metric({
icon,
title,
value,
}:{
icon:React.ReactNode;
title:string;
value:string;
}){

return(

<motion.div
whileHover={{
y:-6,
scale:1.02,
}}
className="
rounded-3xl
border
border-white/10
bg-white/[0.04]
p-6
"
>

<div className="text-cyan-400">
{icon}
</div>

<p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">
{title}
</p>

<p className="mt-2 text-2xl font-bold text-white">
{value}
</p>

</motion.div>

);

}   