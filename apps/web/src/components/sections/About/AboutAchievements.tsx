"use client";

const achievements = [
  {
    value: "25+",
    label: "Projects",
  },
  {
    value: "15+",
    label: "Machine Learning Models",
  },
  {
    value: "50+",
    label: "Datasets",
  },
  {
    value: "100%",
    label: "Passion",
  },
];

export function AboutAchievements() {
  return (
    <div className="mt-24 grid gap-6 md:grid-cols-4">
      {achievements.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-cyan-500/40"
        >
          <div className="text-4xl font-black text-white">
            {item.value}
          </div>

          <div className="mt-3 text-zinc-400">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}