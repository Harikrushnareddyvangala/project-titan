"use client";

import { motion } from "framer-motion";

const sections = [
  { id: "executive", title: "Executive Summary" },
  { id: "engineering", title: "Engineering" },
  { id: "security", title: "Security" },
  { id: "devops", title: "DevOps" },
  { id: "performance", title: "Performance" },
  { id: "technology", title: "Technology" },
  { id: "architecture", title: "Architecture" },
  { id: "languages", title: "Languages" },
  { id: "contributors", title: "Contributors" },
  { id: "timeline", title: "Timeline" },
];


export function AnalyticsSidebar() {

  return (

    <motion.aside
      initial={{opacity:0,x:-30}}
      animate={{opacity:1,x:0}}
      className="
      sticky
      top-28
      h-fit
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-6
      "
    >

      <h3 className="text-lg font-semibold text-white">
        Dashboard
      </h3>

      <div className="mt-6 space-y-2">

        {sections.map(section=>(

          <a
            key={section.id}
            href={`#${section.id}`}
            className="
            block
            rounded-xl
            px-4
            py-3
            text-zinc-400
            transition-all
            duration-300
            hover:bg-cyan-500/10
            hover:text-cyan-300
            "
          >

            {section.title}

          </a>

        ))}

      </div>

    </motion.aside>

  );

}