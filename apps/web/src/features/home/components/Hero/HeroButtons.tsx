export function HeroButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        className="
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-semibold
          text-white
          transition-all
          duration-300
          hover:scale-105
          hover:bg-blue-700
        "
      >
        View Projects
      </button>

      <button
        className="
          rounded-xl
          border
          border-zinc-700
          px-6
          py-3
          font-semibold
          transition-all
          duration-300
          hover:border-blue-500
        "
      >
        Download Resume
      </button>
    </div>
  );
}