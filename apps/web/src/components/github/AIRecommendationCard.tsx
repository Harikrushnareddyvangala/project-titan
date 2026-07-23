"use client";

import type {

AIRecommendation,

} from "@/types/github";

interface Props {

recommendations:
AIRecommendation[];

}

export function AIRecommendationCard({

recommendations,

}: Props) {

return (

<section
className="
rounded-[32px]
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-8
">

<h3
className="
text-2xl
font-bold
text-white
"
>

AI Engineering Recommendations

</h3>

<div className="mt-8 space-y-5">

{recommendations.map(

(rec,index)=>(

<div

key={index}

className="
rounded-2xl
border
border-white/10
bg-white/5
p-5
"

>

<div
className="
flex
items-center
justify-between
"
>

<h4
className="
font-semibold
text-white
"
>

{rec.category}

</h4>

<span
className="
text-sm
text-cyan-400
"
>

{rec.priority}

</span>

</div>

<p
className="
mt-3
text-zinc-300
"
>

{rec.recommendation}

</p>

</div>

),

)}

</div>

</section>

);

}