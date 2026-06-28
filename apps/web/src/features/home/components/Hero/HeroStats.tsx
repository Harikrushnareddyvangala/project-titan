const stats = [
  {
    value: "25+",
    label: "Projects",
  },
  {
    value: "3+",
    label: "Years Experience",
  },
  {
    value: "20+",
    label: "Technologies",
  },
];

export function HeroStats() {
  return (
    <div className="mt-16 grid grid-cols-3 gap-6">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <h3 className="text-3xl font-bold">
            {item.value}
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}