"use client";

import { motion } from "framer-motion";

import type { GithubCommitWeek } from "@/types/github";

interface Props {
    commits: GithubCommitWeek[];
}

export function RepositoryActivityHeatmap({
    commits,
}: Props) {

    const weeks = commits.slice(-12);

    return (

        <motion.section
            id="activity"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="
            rounded-[34px]
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-3xl
            p-8
            "
        >

            <h3 className="text-2xl font-bold text-white">
                Repository Activity
            </h3>

            <p className="mt-2 text-zinc-400">
                Last 12 weeks
            </p>

            <div className="mt-10 flex gap-2 overflow-x-auto">

                {weeks.map((week, index) => (

                    <div
                        key={index}
                        className="flex flex-col gap-1"
                    >

                        {week.days.map((day, dayIndex) => {

                            const opacity =
                                Math.min(
                                    1,
                                    Math.max(
                                        0.15,
                                        day / 10
                                    )
                                );

                            return (

                                <motion.div
                                    key={dayIndex}
                                    whileHover={{
                                        scale: 1.15,
                                    }}
                                    title={`${day} commits`}
                                    className="
                                    h-5
                                    w-5
                                    rounded
                                    bg-cyan-400
                                    "
                                    style={{
                                        opacity,
                                    }}
                                />

                            );

                        })}

                    </div>

                ))}

            </div>

        </motion.section>

    );

}