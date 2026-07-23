"use client";

import { motion } from "framer-motion";
import {
    Briefcase,
    BadgeDollarSign,
    UserCheck,
    Trophy,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props {

    analytics: RepositoryAnalytics | null;

}

export function RecruiterIntelligenceDashboard({

    analytics,

}: Props) {

    if (!analytics) return null;

    const recruiter =
        analytics.recruiterIntelligence;

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

<UserCheck
className="text-emerald-400"
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

Recruiter Intelligence

</h2>

<p className="text-zinc-400">

AI Hiring Assessment

</p>

</div>

</div>

<div
className="
grid
gap-6
md:grid-cols-4
"
>

<Card
icon={<Trophy size={22}/>}
title="Hiring Score"
value={`${recruiter.hiringScore}%`}
/>

<Card
icon={<Briefcase size={22}/>}
title="Engineering Level"
value={recruiter.engineeringLevel}
/>

<Card
icon={<BadgeDollarSign size={22}/>}
title="Salary Range"
value={recruiter.salaryRange}
/>

<Card
icon={<UserCheck size={22}/>}
title="Confidence"
value={`${recruiter.hiringConfidence}%`}
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

Recruiter Verdict

</h3>

<p
className="
leading-8
text-zinc-300
"
>

{recruiter.recruiterVerdict}

</p>

</div>

<div>

<h3
className="
text-xl
font-semibold
text-emerald-400
mb-5
"
>

Recommended Roles

</h3>

<div
className="
flex
flex-wrap
gap-3
"
>

{recruiter.recommendedRoles.map(role => (

<span

key={role}

className="
rounded-full
border
border-emerald-500/30
bg-emerald-500/10
px-5
py-2
text-sm
text-emerald-300
"

>

{role}

</span>

))}

</div>

</div>

</section>

);

}

interface CardProps{

icon:React.ReactNode;

title:string;

value:string;

}

function Card({

icon,

title,

value,

}:CardProps){

return(

<motion.div

whileHover={{

y:-5,

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

<div className="text-cyan-400">

{icon}

</div>

<p
className="
mt-5
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

{value}

</h2>

</motion.div>

);

}