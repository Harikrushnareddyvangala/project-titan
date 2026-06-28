export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute bottom-24 right-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>
  );
}