"use client";

import { motion } from "framer-motion";

import {
    Brain,
    GraduationCap,
    Target,
    BookOpen,
    ArrowRightCircle,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props{

    analytics: RepositoryAnalytics | null;

}

export function EngineeringMentorDashboard({

    analytics,

}:Props){

    if(!analytics) return null;

    const mentor =
        analytics.engineeringMentor;

    return(

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
className="text-indigo-400"
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

AI Engineering Mentor

</h2>

<p className="text-zinc-400">

Personalized Technical Coaching

</p>

</div>

</div>

<div
className="
rounded-3xl
border
border-indigo-500/30
bg-indigo-500/10
p-6
"
>

<h2
className="
text-3xl
font-bold
text-indigo-300
"
>

{mentor.maturityLevel}

</h2>

<p
className="
mt-4
leading-8
text-zinc-300
"
>

{mentor.mentorSummary}

</p>

</div>

<div
className="
grid
gap-6
md:grid-cols-2
"
>

<div
className="
rounded-3xl
border
border-white/10
bg-white/[0.03]
p-6
"
>

<div className="flex items-center gap-2">

<Target
className="text-cyan-400"
/>

<h3
className="
text-xl
font-semibold
text-white
"
>

Learning Priority

</h3>

</div>

<p
className="
mt-4
text-lg
text-cyan-300
"
>

{mentor.learningPriority}

</p>

</div>

<div
className="
rounded-3xl
border
border-white/10
bg-white/[0.03]
p-6
"
>

<div className="flex items-center gap-2">

<BookOpen
className="text-emerald-400"
/>

<h3
className="
text-xl
font-semibold
text-white
"
>

Recommended Skills

</h3>

</div>

<div
className="
mt-5
flex
flex-wrap
gap-3
"
>

{mentor.recommendedSkills.map(skill => (

<span

key={skill}

className="
rounded-full
border
border-emerald-500/30
bg-emerald-500/10
px-4
py-2
text-sm
text-emerald-300
"

>

{skill}

</span>

))}

</div>

</div>

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

Engineering Roadmap

</h3>

<div className="space-y-4">

{mentor.roadmap.map((step,index)=>(

<motion.div

key={step}

initial={{
opacity:0,
x:-20,
}}

whileInView={{
opacity:1,
x:0,
}}

viewport={{
once:true,
}}

transition={{
delay:index*0.08,
}}

className="
flex
items-start
gap-4
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-5
"

>

<ArrowRightCircle
className="
text-cyan-400
mt-1
"
/>

<div>

<p
className="
font-semibold
text-white
"
>

Step {index+1}

</p>

<p
className="
text-zinc-400
mt-1
"
>

{step}

</p>

</div>

</motion.div>

))}

</div>

</div>

</section>

);

}