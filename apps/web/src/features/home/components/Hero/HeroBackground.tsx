export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Main radial glow */}
      <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Left orb */}
      <div className="animate-float absolute left-10 top-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Right orb */}
      <div className="animate-float-delayed absolute right-10 bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Grid overlay */}
      <div className="hero-grid absolute inset-0" />
    </div>
  );
}