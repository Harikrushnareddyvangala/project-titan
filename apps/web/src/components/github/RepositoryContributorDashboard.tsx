"use client";

import { motion } from "framer-motion";
import {
  Users,
  HeartPulse,
  GitBranch,
  Crown,
  Scale,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics | null;
}

export function RepositoryContributorDashboard({
  analytics,
}: Props) {

  if (!analytics) return null;

  return (

    <motion.section
      initial={{ opacity:0,y:30 }}
      whileInView={{ opacity:1,y:0 }}
      viewport={{ once:true }}
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

        <Users
          className="text-cyan-400"
          size={30}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            Contributor Intelligence
          </h3>

          <p className="text-zinc-400">
            AI collaboration analysis
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <MetricCard
          icon={<Users size={22}/>}
          title="Bus Factor"
          value={analytics.busFactor.toString()}
          percentage={analytics.busFactor * 10}
          suffix=""
        />

        <MetricCard
          icon={<HeartPulse size={22}/>}
          title="Team Health"
          value={`${analytics.teamHealth}%`}
          percentage={analytics.teamHealth}
          suffix="%"
        />

        <MetricCard
          icon={<GitBranch size={22}/>}
          title="Collaboration"
          value={`${analytics.collaborationIndex}%`}
          percentage={analytics.collaborationIndex}
          suffix="%"
        />

        <MetricCard
          icon={<Crown size={22}/>}
          title="Top Contributor"
          value={`${analytics.topContributorShare}%`}
          percentage={analytics.topContributorShare}
          suffix="%"
        />

        <motion.div
          whileHover={{
            y:-6,
            scale:1.03,
          }}
          className="
          rounded-3xl
          border
          border-cyan-500/30
          bg-cyan-500/10
          p-6
          flex
          flex-col
          justify-center
          "
        >

          <Scale
            className="text-cyan-400"
            size={24}
          />

          <p className="mt-5 text-sm text-zinc-400">
            Distribution
          </p>

          <h2 className="mt-3 text-xl font-bold text-white">

            {analytics.contributorDistribution}

          </h2>

        </motion.div>

      </div>

    </motion.section>

  );

}

function MetricCard({

  icon,

  title,

  value,

  percentage,

}:{

  icon:React.ReactNode;

  title:string;

  value:string;

  percentage:number;

  suffix:string;

}){

  return(

    <motion.div
      whileHover={{
        y:-5,
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

      <p className="mt-5 text-sm text-zinc-500">

        {title}

      </p>

      <p className="mt-2 text-3xl font-bold text-white">

        {value}

      </p>

      <div className="mt-5 h-2 rounded-full bg-white/10">

        <motion.div
          initial={{ width:0 }}
          whileInView={{
            width:`${Math.min(percentage,100)}%`,
          }}
          viewport={{ once:true }}
          transition={{
            duration:1,
          }}
          className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-cyan-400
          to-blue-500
          "
        />

      </div>

    </motion.div>

  );

}