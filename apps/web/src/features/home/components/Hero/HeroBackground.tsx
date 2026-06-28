export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      {/* Main Glow */}
      <div className="absolute left-1/2 top-[-250px] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[180px]" />

      {/* Floating Orb */}
      <div className="absolute left-24 top-40 h-72 w-72 rounded-full bg-cyan-400/15 blur-[120px] animate-float" />

      {/* Floating Orb */}
      <div className="absolute right-20 bottom-10 h-96 w-96 rounded-full bg-indigo-500/15 blur-[150px] animate-float-delayed" />

      {/* Grid */}
      <div className="hero-grid absolute inset-0" />
    </div>
  );
}