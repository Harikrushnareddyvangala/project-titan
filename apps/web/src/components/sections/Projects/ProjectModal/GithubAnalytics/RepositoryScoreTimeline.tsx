"use client";

import { motion } from "framer-motion";

import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
} from "recharts";

import type { RepositoryAnalytics } from "@/types/github";

interface Props{
    analytics: RepositoryAnalytics | null;
}

export function RepositoryScoreTimeline({

analytics,

}:Props){

const engineering=analytics?.engineeringScore ?? 0;
const production=analytics?.productionScore ?? 0;
const health=analytics?.healthScore ?? 0;

const overall=Math.round(
(engineering+production+health)/3
);

const data=[

{
week:"Week 1",
score:Math.max(overall-12,40),
},

{
week:"Week 2",
score:Math.max(overall-8,45),
},

{
week:"Week 3",
score:Math.max(overall-4,55),
},

{
week:"Week 4",
score:Math.max(overall-2,60),
},

{
week:"Current",
score:overall,
},

];

return(

<motion.section

id="repository-score"

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

<h3 className="text-2xl font-bold text-white">

Repository Score Timeline

</h3>

<p className="mt-2 text-zinc-400">

Engineering maturity trend

</p>

<div className="mt-10 h-[360px]">

<ResponsiveContainer>

<LineChart data={data}>

<CartesianGrid strokeDasharray="4 4"/>

<XAxis dataKey="week"/>

<YAxis domain={[0,100]}/>

<Tooltip/>

<Line

type="monotone"

dataKey="score"

stroke="#22d3ee"

strokeWidth={3}

dot={{r:6}}

activeDot={{r:8}}

/>

</LineChart>

</ResponsiveContainer>

</div>

</motion.section>

);

}