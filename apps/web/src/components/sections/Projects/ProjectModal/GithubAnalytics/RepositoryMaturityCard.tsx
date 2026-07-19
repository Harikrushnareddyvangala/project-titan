"use client";

import { motion } from "framer-motion";
import {
    Award,
    Trophy,
    ShieldCheck,
    Rocket,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props{
    analytics:RepositoryAnalytics|null;
}

export function RepositoryMaturityCard({

    analytics,

}:Props){

    if(!analytics)return null;

    const maturity=analytics.maturity;

    const icon=

    maturity==="World Class"

        ?<Trophy size={32}/>

    :maturity==="Enterprise"

        ?<Award size={32}/>

    :maturity==="Production Ready"

        ?<ShieldCheck size={32}/>

        :<Rocket size={32}/>;

    return(

        <motion.section

        initial={{
            opacity:0,
            y:30,
        }}

        whileInView={{
            opacity:1,
            y:0,
        }}

        viewport={{
            once:true,
        }}

        className="
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        p-8
        "

        >

            <div className="flex items-center gap-4">

                <div className="text-cyan-400">

                    {icon}

                </div>

                <div>

                    <h3 className="text-2xl font-bold text-white">

                        Repository Maturity

                    </h3>

                    <p className="text-zinc-400">

                        AI Engineering Classification

                    </p>

                </div>

            </div>

            <div

            className="
            mt-10
            rounded-3xl
            border
            border-cyan-400/20
            bg-cyan-500/10
            p-8
            "

            >

                <h2 className="text-4xl font-bold text-cyan-300">

                    {maturity}

                </h2>

                <p className="mt-5 leading-8 text-zinc-300">

                    TITAN classified this repository as

                    <span className="ml-2 font-semibold text-cyan-300">

                        {maturity}

                    </span>

                    based on engineering quality,

                    production readiness,

                    contributor diversity,

                    commit history,

                    maintainability,

                    and repository health.

                </p>

            </div>

        </motion.section>

    );

}