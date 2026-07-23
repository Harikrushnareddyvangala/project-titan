"use client";

import { motion } from "framer-motion";
import {
    Brain,
    Cpu,
    Lightbulb,
    Users,
    GraduationCap,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props {

    analytics: RepositoryAnalytics | null;

}

export function DeveloperDNADashboard({

    analytics,

}: Props) {

    if (!analytics) return null;

    const dna = analytics.developerDNA;

    return (

<section
className="
rounded-[34px]
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-8
space-y-8
">

<div className="flex items-center gap-3">

<Brain
className="text-violet-400"
size={30}
/>

<div>

<h2
className="
text-2xl
font-bold
text-white
"
>

Developer DNA

</h2>

<p className="text-zinc-400">

AI Engineering Personality Analysis

</p>

</div>

</div>

<div
className="
rounded-3xl
border
border-violet-500/30
bg-violet-500/10
p-6
"
>

<h3
className="
text-3xl
font-bold
text-violet-300
"
>

{dna.archetype}

</h3>

<p
className="
mt-4
leading-8
text-zinc-300
"
>

{dna.dnaSummary}

</p>

</div>

<div
className="
grid
gap-6
md:grid-cols-5
"
>

<Metric
icon={<Lightbulb size={20}/>}
title="Innovation"
value={dna.innovationScore}
/>

<Metric
icon={<Cpu size={20}/>}
title="Architecture"
value={dna.architectureScore}
/>

<Metric
icon={<Brain size={20}/>}
title="Execution"
value={dna.executionScore}
/>

<Metric
icon={<Users size={20}/>}
title="Collaboration"
value={dna.collaborationScore}
/>

<Metric
icon={<GraduationCap size={20}/>}
title="Learning"
value={dna.learningScore}
/>

</div>

<div>

<h3
className="
text-xl
font-semibold
text-cyan-400
mb-4
"
>

Engineering Strengths

</h3>

<div
className="
flex
flex-wrap
gap-3
"
>

{dna.strengths.map(strength => (

<span

key={strength}

className="
rounded-full
border
border-cyan-500/30
bg-cyan-500/10
px-5
py-2
text-cyan-300
"

>

{strength}

</span>

))}

</div>

</div>

</section>

);

}

interface MetricProps{

icon:React.ReactNode;

title:string;

value:number;

}

function Metric({

icon,

title,

value,

}:MetricProps){

return(

<motion.div

whileHover={{
y:-4,
scale:1.02,
}}

className="
rounded-3xl
border
border-white/10
bg-white/[0.03]
p-6
"

>

<div className="text-violet-400">

{icon}

</div>

<p
className="
mt-4
text-sm
text-zinc-500
"
>

{title}

</p>

<h2
className="
mt-2
text-2xl
font-bold
text-white
"
>

{value}%

</h2>

</motion.div>

);

}