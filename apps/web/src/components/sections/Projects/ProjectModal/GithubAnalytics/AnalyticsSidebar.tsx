"use client";

import { motion } from "framer-motion";

import {
    LayoutDashboard,
    Cpu,
    Shield,
    Server,
    Zap,
    Boxes,
    Network,
    Code2,
    Users,
    Clock3,
} from "lucide-react";

const sections = [

{
id:"executive",
title:"Executive",
icon:LayoutDashboard,
},

{
id:"engineering",
title:"Engineering",
icon:Cpu,
},

{
id:"security",
title:"Security",
icon:Shield,
},

{
id:"devops",
title:"DevOps",
icon:Server,
},

{
id:"performance",
title:"Performance",
icon:Zap,
},

{
id:"technology",
title:"Technology",
icon:Boxes,
},

{
id:"architecture",
title:"Architecture",
icon:Network,
},

{
id:"languages",
title:"Languages",
icon:Code2,
},

{
id:"contributors",
title:"Contributors",
icon:Users,
},

{
id:"timeline",
title:"Timeline",
icon:Clock3,
},

];

export function AnalyticsSidebar(){

return(

<motion.aside

initial={{
opacity:0,
x:-25,
}}

animate={{
opacity:1,
x:0,
}}

className="
sticky
top-28
rounded-[34px]
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-6
"

>

<h2 className="text-xl font-bold text-white">

Analytics Dashboard

</h2>

<p className="mt-2 text-sm text-zinc-500">

Enterprise Navigation

</p>

<div className="mt-8 space-y-2">

{sections.map((section)=>{

const Icon=section.icon;

return(

<motion.a

key={section.id}

href={`#${section.id}`}

whileHover={{
x:6,
}}

whileTap={{
scale:.97,
}}

className="
flex
items-center
gap-4
rounded-2xl
px-4
py-3
text-zinc-400
transition-all
duration-300
hover:bg-cyan-500/10
hover:text-cyan-300
"

>

<Icon size={18}/>

<span>

{section.title}

</span>

</motion.a>

);

})}

</div>

</motion.aside>

);

}