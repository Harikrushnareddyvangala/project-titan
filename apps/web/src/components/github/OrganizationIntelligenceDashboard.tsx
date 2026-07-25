"use client";

import { motion } from "framer-motion";

import {
    Building2,
    ShieldCheck,
    Rocket,
    Users,
    Gauge,
} from "lucide-react";

import type {
    RepositoryAnalytics,
} from "@/types/github";

interface Props{

    analytics: RepositoryAnalytics | null;

}

export function OrganizationIntelligenceDashboard({

    analytics,

}:Props){

    if(!analytics) return null;

    const org =
        analytics.organizationIntelligence;

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

<Building2
className="text-orange-400"
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

Organization Intelligence

</h2>

<p className="text-zinc-400">

Enterprise Engineering Assessment

</p>

</div>

</div>

<div
className="
rounded-3xl
border
border-orange-500/30
bg-orange-500/10
p-6
"
>

<h2
className="
text-3xl
font-bold
text-orange-300
"
>

{org.organizationalReadiness}%

</h2>

<p
className="
mt-4
leading-8
text-zinc-300
"
>

{org.executiveSummary}

</p>

</div>

<div
className="
grid
gap-6
md:grid-cols-3
"
>

<Card
icon={<Users size={20}/>}
title="Engineering Culture"
value={`${org.engineeringCulture}%`}
/>

<Card
icon={<Rocket size={20}/>}
title="Delivery Maturity"
value={`${org.deliveryMaturity}%`}
/>

<Card
icon={<ShieldCheck size={20}/>}
title="Governance"
value={`${org.engineeringGovernance}%`}
/>

<Card
icon={<Gauge size={20}/>}
title="Scaling"
value={`${org.scalingReadiness}%`}
/>

<Card
icon={<Rocket size={20}/>}
title="Innovation"
value={`${org.innovationCulture}%`}
/>

<Card
icon={<ShieldCheck size={20}/>}
title="Technical Debt"
value={`${org.technicalDebt}%`}
/>

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

<div className="text-orange-400">

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