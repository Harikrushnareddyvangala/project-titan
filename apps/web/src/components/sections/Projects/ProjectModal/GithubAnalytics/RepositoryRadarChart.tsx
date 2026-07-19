"use client";

import { motion } from "framer-motion";

import {
RadarChart,
Radar,
PolarGrid,
PolarAngleAxis,
PolarRadiusAxis,
ResponsiveContainer,
} from "recharts";

import type {
RepositoryAnalytics,
} from "@/types/github";

interface Props{

analytics:RepositoryAnalytics | null;

}

export function RepositoryRadarChart({

analytics,

}:Props){

const engineering=analytics?.engineeringScore ?? 0;

const production=analytics?.productionScore ?? 0;

const health=analytics?.healthScore ?? 0;

const data=[

{
subject:"Engineering",
value:engineering,
},

{
subject:"Production",
value:production,
},

{
subject:"Health",
value:health,
},

{
subject:"Quality",
value:health,
},

{
subject:"Performance",
value:engineering,
},

{
subject:"Security",
value:production,
},

];

return(

<motion.section

id="radar"

initial={{opacity:0,y:20}}

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

<h3 className="text-2xl font-bold text-white">

AI Repository Radar

</h3>

<p className="mt-2 text-zinc-400">

Engineering capability overview

</p>

<div className="mt-10 h-[420px]">

<ResponsiveContainer>

<RadarChart data={data}>

<PolarGrid/>

<PolarAngleAxis dataKey="subject"/>

<PolarRadiusAxis domain={[0,100]}/>

<Radar

dataKey="value"

fillOpacity={0.45}

/>

</RadarChart>

</ResponsiveContainer>

</div>

</motion.section>

);

}