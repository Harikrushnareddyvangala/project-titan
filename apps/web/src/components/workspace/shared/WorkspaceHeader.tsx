"use client";

import { Code2 } from "lucide-react";

interface WorkspaceHeaderProps {

    title: string;

    description: string;

}

export function WorkspaceHeader({

    title,

    description,

}: WorkspaceHeaderProps) {

    return (

        <section
            className="
            rounded-[36px]
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-3xl
            p-10
            "
        >

            <div className="flex items-center gap-4">

                <Code2
                    className="text-cyan-400"
                    size={34}
                />

                <div>

                    <h1
                        className="
                        text-4xl
                        font-bold
                        text-white
                        "
                    >

                        {title}

                    </h1>

                    <p
                        className="
                        mt-3
                        text-zinc-400
                        leading-7
                        "
                    >

                        {description}

                    </p>

                </div>

            </div>

        </section>

    );

}