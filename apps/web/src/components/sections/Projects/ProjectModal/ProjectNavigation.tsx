"use client";

interface ProjectNavigationProps {
  active: string;
  onSelect: (section: string) => void;
}

const sections = [
  "Overview",
  "GitHub",
  "Gallery",
  "Metrics",
];

export function ProjectNavigation({
  active,
  onSelect,
}: ProjectNavigationProps) {
  return (
    <div
      className="
        sticky
        top-0
        z-40
        border-y
        border-white/10
        bg-zinc-950/90
        backdrop-blur-xl
      "
    >
      <div className="flex justify-center gap-2 overflow-x-auto px-6 py-4">
        {sections.map((section) => {
          const selected =
            active === section;

          return (
            <button
              key={section}
              onClick={() =>
                onSelect(section)
              }
              className={`
                whitespace-nowrap
                rounded-full
                px-5
                py-2
                text-sm
                font-medium
                transition-all
                duration-300

                ${
                  selected
                    ? "bg-cyan-500 text-black"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                }
              `}
            >
              {section}
            </button>
          );
        })}
      </div>
    </div>
  );
}