"use client";

import { motion } from "framer-motion";

import {
Cpu,
Database,
Cloud,
Server,
Globe,
Brain,
} from "lucide-react";

import type {
GithubRepository,
GithubLanguages,
} from "@/types/github";

interface Props{

repository:GithubRepository;
languages:GithubLanguages;

}

export function TechnologyDependencyGraph({

repository,
languages,

}:Props){

const tech:string[]=[];

const lang=Object.keys(languages).join(" ").toLowerCase();

if(lang.includes("typescript")) tech.push("React");

if(lang.includes("javascript")) tech.push("Next.js");

if(lang.includes("python")) tech.push("Python");

if(
repository.description?.toLowerCase().includes("fastapi")
){
tech.push("FastAPI");
}

if(
repository.description?.toLowerCase().includes("docker")
){
tech.push("Docker");
}

if(
repository.description?.toLowerCase().includes("kubernetes")
){
tech.push("Kubernetes");
}

if(
repository.description?.toLowerCase().includes("aws")
){
tech.push("AWS");
}

if(
repository.description?.toLowerCase().includes("langchain")
){
tech.push("LangChain");
}

if(
repository.description?.toLowerCase().includes("openai")
){
tech.push("OpenAI");
}

return(

<motion.section

id="technology-graph"

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

<div className="flex items-center gap-3">

<Brain
className="text-cyan-400"
size={28}
/>

<div>

<h3 className="text-2xl font-bold text-white">

Technology Dependency Graph

</h3>

<p className="text-zinc-400">

AI Architecture Detection

</p>

</div>

</div>

<div className="mt-10 flex flex-wrap gap-4">

{tech.map((item)=>(

<motion.div

key={item}

whileHover={{
scale:1.05,
y:-4,
}}

className="
rounded-full
border
border-cyan-400/20
bg-cyan-500/10
px-5
py-3
text-cyan-300
"

>

{item}

</motion.div>

))}

</div>

</motion.section>

);

}