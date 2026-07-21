"use client";

import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Gauge,
  Rocket,
  CalendarDays,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics | null;
}

export function RepositoryCommitDashboard({
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

        <Activity
          size={30}
          className="text-cyan-400"
        />

        <div>

          <h3 className="text-2xl font-bold text-white">

            Commit Intelligence

          </h3>

          <p className="text-zinc-400">

            AI development analytics

          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <MetricCard
          icon={<TrendingUp size={22}/>}
          title="Velocity"
          value={analytics.developmentVelocity}
        />

        <MetricCard
          icon={<Activity size={22}/>}
          title="Momentum"
          value={analytics.developmentMomentum}
        />

        <MetricCard
          icon={<Gauge size={22}/>}
          title="Stability"
          value={analytics.engineeringStability}
        />

        <MetricCard
          icon={<Rocket size={22}/>}
          title="Release Ready"
          value={analytics.releaseReadiness}
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

          <CalendarDays
            className="text-cyan-400"
            size={24}
          />

          <p className="mt-5 text-sm text-zinc-400">

            Activity Trend

          </p>

          <h2 className="mt-3 text-xl font-bold text-white">

            {analytics.activityTrend}

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

}:{

  icon:React.ReactNode;

  title:string;

  value:number;

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

        {value}%

      </p>

      <div className="mt-5 h-2 rounded-full bg-white/10">

        <motion.div
          initial={{ width:0 }}
          whileInView={{
            width:`${value}%`,
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