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
            whileHover={{ y: -6 }}
            className="
            rounded-[34px]
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-3xl
            p-8
        "
        >

            <h3 className="text-xl font-semibold text-white">
                Repository Timeline
            </h3>

            <p className="mt-2 text-zinc-400">
                Repository lifecycle and maintenance history.
            </p>

            <div className="relative mt-10">

                <div
                    className="
                    absolute
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

                <div className="space-y-8">

                    {events.map((event, index) => {

                        const Icon = event.icon;

                        return (

                            <motion.div
                                key={event.title}
                                initial={{
                                    opacity: 0,
                                    x: -20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.08,
                                }}
                                className="relative flex gap-6"
                            >

                                <div
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
                                    <Icon
                                        size={18}
                                        className="text-cyan-300"
                                    />
                                </div>

                                <div className="flex-1">

                                    <h4 className="font-semibold text-white">
                                        {event.title}
                                    </h4>

                                    <p className="mt-1 text-sm text-zinc-400">

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

                                    </p>

                                </div>

                            </motion.div>

                        );

                    })}

                </div>

            </div>

        </motion.div>
    );
}