import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2"
      aria-label="Project TITAN Home"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white transition-transform duration-300 group-hover:scale-105">
        T
      </div>

      <div className="hidden sm:block">
        <p className="text-sm font-semibold leading-none">
          Project
        </p>

        <p className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-lg font-black leading-none text-transparent">
          TITAN
        </p>
      </div>
    </Link>
  );
}