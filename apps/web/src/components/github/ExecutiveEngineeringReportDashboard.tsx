"use client";

import { motion } from "framer-motion";

import {
    Briefcase,
    ShieldCheck,
    Building2,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props {

    analytics: RepositoryAnalytics | null;

}

export function ExecutiveEngineeringReportDashboard({

    analytics,

}: Props) {

    if (!analytics) return null;

    const report = analytics.executiveReport;

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

<Sparkles
className="text-cyan-400"
size={30}
/>

<div>

<h2
className="
text-3xl
font-bold
text-white
"
>

Executive Engineering Report

</h2>

<p className="text-zinc-400">

Comprehensive AI Executive Assessment

</p>

</div>

</div>

<div
className="
rounded-3xl
border
border-cyan-500/30
bg-cyan-500/10
p-6
"
>

<h2
className="
text-2xl
font-bold
text-cyan-300
"
>

{report.title}

</h2>

<p
className="
mt-4
leading-8
text-zinc-300
"
>

{report.summary}

</p>

</div>

<div
className="
grid
gap-6
md:grid-cols-3
"
>

<ExecutiveCard
icon={<ShieldCheck size={22}/>}
title="Engineering Verdict"
value={report.engineeringVerdict}
/>

<ExecutiveCard
icon={<Briefcase size={22}/>}
title="Recruiter Verdict"
value={report.recruiterVerdict}
/>

<ExecutiveCard
icon={<Building2 size={22}/>}
title="Enterprise Verdict"
value={report.enterpriseVerdict}
/>

</div>

<div
className="
grid
gap-8
md:grid-cols-2
"
>

<InsightPanel

title="Strengths"

icon={<CheckCircle2 className="text-emerald-400"/>}

items={report.strengths}

/>

<InsightPanel

title="Concerns"

icon={<AlertTriangle className="text-amber-400"/>}

items={report.concerns}

/>

</div>

<div>

<h3
className="
text-2xl
font-bold
text-cyan-400
mb-5
"
>

Strategic Recommendations

</h3>

<div className="space-y-5">

{report.recommendations.map((recommendation,index)=>(

<motion.div

key={index}

initial={{
opacity:0,
y:20,
}}

whileInView={{
opacity:1,
y:0,
}}

viewport={{
once:true,
}}

transition={{
delay:index*0.08,
}}

className="
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-5
"

>

<h4
className="
font-semibold
text-white
"
>

{recommendation.title}

</h4>

<p
className="
mt-2
leading-7
text-zinc-400
"
>

{recommendation.description}

</p>

</motion.div>

))}

</div>

</div>

</section>

);

}

interface ExecutiveCardProps{

icon:React.ReactNode;

title:string;

value:string;

}

function ExecutiveCard({

icon,

title,

value,

}:ExecutiveCardProps){

return(

<div
className="
rounded-3xl
border
border-white/10
bg-white/[0.03]
p-6
"
>

<div className="text-cyan-400">

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
text-xl
font-bold
text-white
"
>

{value}

</h2>

</div>

);

}

interface InsightPanelProps{

title:string;

icon:React.ReactNode;

items:string[];

}

function InsightPanel({

title,

icon,

items,

}:InsightPanelProps){

return(

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

{icon}

<h3
className="
text-xl
font-semibold
text-white
"
>

{title}

</h3>

</div>

<div
className="
mt-5
space-y-3
"
>

{items.map(item=>(

<div
key={item}
className="flex gap-3"
>

<CheckCircle2
size={18}
className="mt-1 text-cyan-400"
/>

<span className="text-zinc-300">

{item}

</span>

</div>

))}

</div>

</div>

);

}