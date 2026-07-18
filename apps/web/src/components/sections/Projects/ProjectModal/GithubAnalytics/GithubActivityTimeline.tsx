"use client";

import { motion } from "framer-motion";

import {
    Calendar,
    GitCommit,
    Rocket,
    Globe,
    CheckCircle2,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface Props {
    repository: GithubRepository;
}
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    show: {
        opacity: 1,
        y: 0,
    },
};

export function GithubActivityTimeline({
    repository,
}: Props) {

    const events = [
        {
            icon: Calendar,
            title: "Repository Created",
            date: repository.created_at,
            color: "cyan",
        },

        {
            icon: Rocket,
            title: "Default Branch",
            date: repository.default_branch,
            color: "purple",
        },

        {
            icon: GitCommit,
            title: "Last Push",
            date: repository.pushed_at,
            color: "blue",
        },

        {
            icon: Calendar,
            title: "Last Updated",
            date: repository.updated_at,
            color: "emerald",
        },

        {
            icon: Globe,
            title: "Visibility",
            date: repository.visibility,
            color: "amber",
        },

        {
            icon: CheckCircle2,
            title: "Repository Status",
            date: "Active",
            color: "green",
        },
    ];

    return (
        <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={containerVariants}
    whileHover={{
        y: -6,
        scale: 1.01,
    }}
            className="
            relative
            overflow-hidden
            rounded-[34px]
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-3xl
            p-8
        "
        >
            <motion.div
    className="
        absolute
        -right-24
        -top-24
        h-72
        w-72
        rounded-full
        bg-cyan-500/10
        blur-[140px]
        pointer-events-none
    "
    animate={{
        scale: [1, 1.15, 1],
        opacity: [0.15, 0.4, 0.15],
    }}
    transition={{
        duration: 10,
        repeat: Infinity,
    }}
/>

<div className="relative z-10">

            <motion.h3
    variants={itemVariants}
    className="text-xl font-semibold text-white"
>
                Repository Timeline
            </motion.h3>

            <motion.p
                variants={itemVariants}
                className="mt-2 text-zinc-400">
                Repository lifecycle and maintenance history.
            </motion.p>

            <div className="relative mt-10">

                <motion.div
    initial={{
        scaleY: 0,
    }}
    whileInView={{
        scaleY: 1,
    }}
    viewport={{
        once: true,
    }}
    transition={{
        duration: 1,
    }}
    className="
        absolute
        origin-top
        left-5
        top-2
        bottom-2
        w-px
        bg-gradient-to-b
        from-cyan-500
        via-blue-500
        to-purple-500
    "
/>

                <motion.div
    variants={containerVariants}
    className="space-y-8"
>

                    {events.map((event, index) => {

                        const Icon = event.icon;

                        return (

                            <motion.div
    key={event.title}
    variants={itemVariants}
    whileHover={{
        x: 8,
        scale: 1.02,
    }}
    transition={{
        type: "spring",
        stiffness: 260,
    }}
                                className="relative flex gap-6"
                            >

                                <motion.div
    animate={{
        scale: [1, 1.08, 1],
        boxShadow: [
            "0 0 0 rgba(34,211,238,0)",
            "0 0 24px rgba(34,211,238,.35)",
            "0 0 0 rgba(34,211,238,0)",
        ],
    }}
    transition={{
        duration: 3,
        repeat: Infinity,
        delay: index * 0.2,
    }}
    className="
        relative
        z-10
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-white/10
        bg-zinc-900
    "
>
    <motion.div
    className="
        absolute
        inset-0
        rounded-full
        bg-cyan-400/20
    "
    animate={{
        scale:[1,1.8,1],
        opacity:[0.4,0,0.4],
    }}
    transition={{
        duration:3,
        repeat:Infinity,
        delay:index*0.2,
    }}
/>
                                    <Icon
                                        size={18}
                                        className="text-cyan-300"
                                    />
                                </motion.div>

                                <div className="flex-1">

                                    <h4 className="font-semibold text-white">
                                        {event.title}
                                    </h4>

                                    <motion.p
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay: index * 0.08 + 0.15 }}
    className="mt-1 text-sm text-zinc-400"
>   

                                        {event.title.includes("Branch")
                                            ? event.date
                                            : event.title.includes("Visibility")
                                                ? event.date
                                                : event.title.includes("Status")
                                                    ? event.date
                                                    : new Date(
                                                        event.date,
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        },
                                                    )}

                                    </motion.p>

                                </div>

                            </motion.div>

                        );

                    })}

                </motion.div>

            </div>

           <motion.div
    initial={{
        scaleX: 0,
    }}
    whileInView={{
        scaleX: 1,
    }}
    viewport={{
        once: true,
    }}
    transition={{
        duration: 1,
        delay: 0.3,
    }}
    className="
        mt-8
        h-px
        origin-left
        bg-gradient-to-r
        from-cyan-400
        via-blue-500
        to-transparent
    "
/> 
            </div>
        </motion.div>
    );
}