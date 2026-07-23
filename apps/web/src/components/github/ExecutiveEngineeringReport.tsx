"use client";

import type {
  ExecutiveEngineeringReport,
} from "@/types/github";

interface Props {

  report: ExecutiveEngineeringReport;

}

export default function ExecutiveEngineeringReport({

  report,

}: Props) {

  return (

<section
className="
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-xl
shadow-2xl
p-8
space-y-8
">

{/* ------------------------------------------------ */}

<div>

<h1
className="
text-3xl
font-bold
text-white
"
>

{report.title}

</h1>

<p
className="
mt-5
leading-8
text-zinc-300
"
>

{report.summary}

</p>

</div>

{/* ------------------------------------------------ */}

<div
className="
grid
grid-cols-3
gap-6
"
>

<VerdictCard

title="Engineering"

value={report.engineeringVerdict}

/>

<VerdictCard

title="Recruiter"

value={report.recruiterVerdict}

/>

<VerdictCard

title="Enterprise"

value={report.enterpriseVerdict}

/>

</div>

{/* ------------------------------------------------ */}

<div
className="
grid
grid-cols-2
gap-10
"
>

<div>

<h2
className="
text-xl
font-semibold
text-emerald-400
mb-4
"
>

Strengths

</h2>

<ul
className="
space-y-3
"
>

{report.strengths.map((item) => (

<li
key={item}
className="
text-zinc-300
"
>

✅ {item}

</li>

))}

</ul>

</div>

<div>

<h2
className="
text-xl
font-semibold
text-red-400
mb-4
"
>

Concerns

</h2>

<ul
className="
space-y-3
"
>

{report.concerns.map((item) => (

<li
key={item}
className="
text-zinc-300
"
>

⚠️ {item}

</li>

))}

</ul>

</div>

</div>

{/* ------------------------------------------------ */}

<div>

<h2
className="
text-xl
font-semibold
text-cyan-400
mb-5
"
>

AI Recommendations

</h2>

<div
className="
space-y-4
"
>

{report.recommendations.map((recommendation) => (

<div
key={recommendation.title}
className="
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-5
"
>

<h3
className="
font-semibold
text-white
"
>

{recommendation.title}

</h3>

<p
className="
text-zinc-400
mt-2
leading-7
"
>

{recommendation.description}

</p>

</div>

))}

</div>

</div>

</section>

);

}

interface CardProps{

title:string;

value:string;

}

function VerdictCard({

title,

value,

}:CardProps){

return(

<div
className="
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-6
"
>

<p
className="
text-zinc-400
"
>

{title}

</p>

<p
className="
mt-3
text-lg
font-semibold
text-white
leading-7
"
>

{value}

</p>

</div>

);

}