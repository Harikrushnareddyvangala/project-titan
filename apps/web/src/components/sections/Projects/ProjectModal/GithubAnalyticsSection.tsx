"use client";
import { motion } from "framer-motion";
import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
  GithubContributor,
} from "@/types/github";

import { AnalyticsHeader } from "./GithubAnalytics/AnalyticsHeader";
import {
  DashboardGrid,} from "./GithubAnalytics/DashboardGrid";

interface GithubAnalyticsSectionProps {
  repository: GithubRepository | null;
  languages: GithubLanguages;
  commitActivity: GithubCommitWeek[];
   contributors: GithubContributor[];
  loading: boolean;
}

export function GithubAnalyticsSection({
  repository,
  languages,
  commitActivity,
  contributors,
  loading,
}: GithubAnalyticsSectionProps) {
  if (loading) {
    return <div className="p-10 text-center text-zinc-400">Loading...</div>;
  }

  if (!repository) {
    return <div className="p-10 text-center text-zinc-400">No Repository</div>;
  }

  return (
   <section
className="
relative
overflow-hidden
rounded-[40px]
bg-gradient-to-br
from-zinc-950
via-zinc-900
to-black
p-10
text-white
space-y-10
"
>
  {/* Background Glow */}

<motion.div
className="
absolute
-left-44
-top-44
h-[520px]
w-[520px]
rounded-full
bg-cyan-500/10
blur-[180px]
"
animate={{
scale:[1,1.2,1],
opacity:[.2,.5,.2],
}}
transition={{
duration:18,
repeat:Infinity,
}}
/>

<motion.div
className="
absolute
-right-52
-bottom-0
h-[420px]
w-[420px]
rounded-full
bg-violet-500/10
blur-[180px]
"
animate={{
scale:[1,1.15,1],
opacity:[.2,.45,.2],
}}
transition={{
duration:20,
repeat:Infinity,
}}
/>
      <AnalyticsHeader />
      <div
className="
h-px
w-full
bg-gradient-to-r
from-transparent
via-cyan-400/40
to-transparent
"
/>
      <DashboardGrid
  repository={repository}
  languages={languages}
  commits={commitActivity}
  contributors={contributors}
/>
     
   </section>
 );
}