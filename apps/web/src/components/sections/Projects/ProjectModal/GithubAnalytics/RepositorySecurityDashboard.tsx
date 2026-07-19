"use client";

import { motion } from "framer-motion";

import {
    Shield,
    Lock,
    BookOpen,
    FolderGit2,
    AlertTriangle,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props{
    analytics:RepositoryAnalytics|null;
}

export function RepositorySecurityDashboard({

    analytics,

}:Props){

    if(!analytics)return null;

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

            <div className="flex items-center gap-3">

                <Shield
                    className="text-cyan-400"
                    size={28}
                />

                <div>

                    <h3 className="text-2xl font-bold text-white">

                        Security & DevOps

                    </h3>

                    <p className="text-zinc-400">

                        AI Security Assessment

                    </p>

                </div>

            </div>

            <div className="grid md:grid-cols-4 gap-6 mt-10">

                <Card
                    icon={<Shield size={20}/>}
                    title="Security"
                    value={`${analytics.securityScore}%`}
                />

                <Card
                    icon={<Lock size={20}/>}
                    title="DevOps"
                    value={`${analytics.devopsScore}%`}
                />

                <Card
                    icon={<BookOpen size={20}/>}
                    title="License"
                    value={
                        analytics.hasLicense
                        ? "Present"
                        : "Missing"
                    }
                />

                <Card
                    icon={<FolderGit2 size={20}/>}
                    title="Archived"
                    value={
                        analytics.archived
                        ? "Yes"
                        : "No"
                    }
                />

            </div>

            <div
            className="
            mt-10
            rounded-3xl
            border
            border-cyan-400/20
            bg-cyan-500/10
            p-6
            "
            >

                <p className="leading-8 text-zinc-300">

                    TITAN analysed repository
                    security, documentation,
                    DevOps readiness,
                    repository maintenance
                    and governance.

                </p>

            </div>

        </motion.section>

    );

}

function Card({
icon,
title,
value,
}:{
icon:React.ReactNode;
title:string;
value:string;
}){

return(

<div
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

<p className="mt-5 text-xs uppercase text-zinc-500">
{title}
</p>

<p className="mt-2 text-2xl font-bold text-white">
{value}
</p>

</div>

);

}