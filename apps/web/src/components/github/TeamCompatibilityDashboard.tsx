"use client";

import { motion } from "framer-motion";

import {
    Users,
    Crown,
    MessageCircle,
    UserCheck,
    Briefcase,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props{

    analytics: RepositoryAnalytics | null;

}

export function TeamCompatibilityDashboard({

    analytics,

}:Props){

    if(!analytics) return null;

    const team =
        analytics.teamCompatibility;

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

<Users
className="text-pink-400"
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

Team Compatibility

</h2>

<p className="text-zinc-400">

AI Collaboration Intelligence

</p>

</div>

</div>

<div
className="
rounded-3xl
border
border-pink-500/30
bg-pink-500/10
p-6
"
>

<h2
className="
text-3xl
font-bold
text-pink-300
"
>

{team.compatibilityScore}%

</h2>

<p
className="
mt-4
leading-8
text-zinc-300
"
>

{team.executiveSummary}

</p>

</div>

<div
className="
grid
gap-6
md:grid-cols-4
"
>

<Card
icon={<Briefcase size={20}/>}
title="Ideal Role"
value={team.idealRole}
/>

<Card
icon={<MessageCircle size={20}/>}
title="Communication"
value={team.communicationStyle}
/>

<Card
icon={<Crown size={20}/>}
title="Leadership"
value={`${team.leadershipReadiness}%`}
/>

<Card
icon={<UserCheck size={20}/>}
title="Mentoring"
value={`${team.mentoringPotential}%`}
/>

</div>

<div
className="
rounded-3xl
border
border-cyan-500/20
bg-cyan-500/10
p-6
"
>

<h3
className="
text-xl
font-semibold
text-cyan-300
mb-3
"
>

Preferred Team Environment

</h3>

<p
className="
text-zinc-300
leading-8
"
>

{team.preferredTeamSize}

</p>

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

<div className="text-pink-400">

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

{value}

</h2>

</motion.div>

);

}