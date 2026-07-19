"use client";

import { motion } from "framer-motion";

import {

Package,

Brain,

Shield,

Cpu,

} from "lucide-react";

import type {

RepositoryAnalytics,

} from "@/types/github";

interface Props{

analytics:RepositoryAnalytics|null;

}

export function DependencyIntelligence({

analytics,

}:Props){

if(!analytics)return null;

return(

<motion.section

initial={{opacity:0,y:30}}

whileInView={{opacity:1,y:0}}

viewport={{once:true}}

className="
rounded-[34px]
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-8
"

>

<div className="flex items-center gap-3">

<Package
className="text-cyan-400"
size={28}
/>

<div>

<h3 className="text-2xl font-bold text-white">

Dependency Intelligence

</h3>

<p className="text-zinc-400">

AI Ecosystem Detection

</p>

</div>

</div>

<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-10">

<Card
icon={<Cpu size={20}/>}
title="Frontend"
value={analytics.frontendFramework}
/>

<Card
icon={<Cpu size={20}/>}
title="Backend"
value={analytics.backendFramework}
/>

<Card
icon={<Brain size={20}/>}
title="AI Library"
value={analytics.aiLibrary}
/>

<Card
icon={<Shield size={20}/>}
title="Risk"
value={analytics.dependencyRisk}
/>

<Card
icon={<Package size={20}/>}
title="Maturity"
value={analytics.technologyMaturity}
/>

</div>

</motion.section>

);

}

function Card({

icon,

title,

value,

}:{

icon:React.ReactNode;

title:string;

value:string;

}){

return(

<div
className="
rounded-3xl
border
border-white/10
bg-white/[0.04]
p-6
"
>

<div className="text-cyan-400">

{icon}

</div>

<p className="mt-5 text-xs uppercase text-zinc-500">

{title}

</p>

<p className="mt-2 text-xl font-bold text-white">

{value}

</p>

</div>

);

}