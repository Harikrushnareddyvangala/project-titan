"use client";

import { motion } from "framer-motion";
import {
    Lightbulb,
    GitCommit,
    Rocket,
    Wrench,
    CheckCircle2,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface Props {
    repository: GithubRepository;
}

export function RepositoryTimeline({
    repository,
}: Props) {

    const created = new Date(repository.created_at);

    const updated = new Date(repository.updated_at);

    const milestones = [
        {
            title: "Project Idea",
            description: "Repository planned",
            icon: Lightbulb,
            date: created,
        },
        {
            title: "Initial Commit",
            description: "Repository created",
            icon: GitCommit,
            date: created,
        },
        {
            title: "Active Development",
            description: "Core implementation",
            icon: Wrench,
            date: new Date(
                (created.getTime() + updated.getTime()) / 2,
            ),
        },
        {
            title: "Production Ready",
            description: "Latest stable version",
            icon: Rocket,
            date: updated,
        },
        {
            title: "Current State",
            description: "Latest update",
            icon: CheckCircle2,
            date: updated,
        },
    ];

    return (
        <section id = "timeline" className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

            <h2 className="text-2xl font-bold text-white">
                Development Timeline
            </h2>

            <p className="mt-2 text-zinc-400">
                Evolution of this project.
            </p>

            <div className="relative mt-10 ml-6">

                <div
                    className="
                    absolute
                    left-4
                    top-0
                    bottom-0
                    w-px
                    bg-white/10
                    "
                />

                <div className="space-y-10">

                    {milestones.map((item, index) => {

                        const Icon = item.icon;

                        return (

                            <motion.div
                                key={item.title}
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
                                    delay: index * 0.12,
                                }}
                                className="relative flex gap-6"
                            >

                                <div
                                    className="
                                    relative
                                    z-10
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-cyan-500
                                    text-white
                                    "
                                >
                                    <Icon size={16} />
                                </div>

                                <div>

                                    <h4 className="font-semibold text-white">
                                        {item.title}
                                    </h4>

                                    <p className="mt-1 text-sm text-zinc-400">
                                        {item.description}
                                    </p>

                                    <p className="mt-2 text-xs text-zinc-500">
                                        {item.date.toLocaleDateString()}
                                    </p>

                                </div>

                            </motion.div>

                        );

                    })}

                </div>

            </div>

        </section>
    );

}