"use client";

import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Building2,
  Code2,
  Wrench,
} from "lucide-react";

import type { RepositoryAnalytics } from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics | null;
}

export function RepositoryEngineeringDashboard({
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

        <Award
          className="text-cyan-400"
          size={30}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Engineering Intelligence
          </h3>

          <p className="text-zinc-400">
            Enterprise engineering assessment
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <MetricCard
          icon={<Code2 size={22}/>}
          title="Code Quality"
          value={analytics.codeQuality}
        />

        <MetricCard
          icon={<BookOpen size={22}/>}
          title="Documentation"
          value={analytics.documentationQuality}
        />

        <MetricCard
          icon={<Wrench size={22}/>}
          title="Maintainability"
          value={analytics.maintainability}
        />

        <MetricCard
          icon={<Building2 size={22}/>}
          title="Enterprise"
          value={analytics.enterpriseReadiness}
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

          <p className="text-sm text-zinc-400">
            Repository Grade
          </p>

          <h2 className="mt-3 text-5xl font-black text-cyan-300">

            {analytics.repositoryGrade}

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

          transition={{ duration:1 }}

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