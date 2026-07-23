"use client";

import { motion } from "framer-motion";

import {
    TrendingUp,
    Briefcase,
    Crown,
    DollarSign,
    ArrowRightCircle,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props{

    analytics: RepositoryAnalytics | null;

}

export function CareerIntelligenceDashboard({

    analytics,

}:Props){

    if(!analytics) return null;

    const career =
        analytics.careerIntelligence;

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

<TrendingUp
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

Career Intelligence

</h2>

<p className="text-zinc-400">

AI Career Assessment

</p>

</div>

</div>

<div
className="
rounded-3xl
border
border-emerald-500/30
bg-emerald-500/10
p-6
"
>

<h2
className="
text-3xl
font-bold
text-emerald-300
"
>

{career.careerStage}

</h2>

<p
className="
mt-4
leading-8
text-zinc-300
"
>

{career.executiveSummary}

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

icon={<Crown size={20}/>}

title="Promotion"

value={`${career.promotionReadiness}%`}

/>

<Card

icon={<Briefcase size={20}/>}

title="Market Demand"

value={`${career.marketDemand}%`}

/>

<Card

icon={<TrendingUp size={20}/>}

title="Leadership"

value={`${career.leadershipPotential}%`}

/>

<Card

icon={<DollarSign size={20}/>}

title="Market Value"

value={career.estimatedMarketValue}

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

Recommended Next Step

</h3>

<div
className="
rounded-3xl
border
border-cyan-500/20
bg-cyan-500/10
p-6
flex
gap-4
items-start
"
>

<ArrowRightCircle
className="text-cyan-400 mt-1"
/>

<p
className="
leading-8
text-zinc-300
"
>

{career.nextCareerStep}

</p>

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

<div className="text-emerald-400">

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