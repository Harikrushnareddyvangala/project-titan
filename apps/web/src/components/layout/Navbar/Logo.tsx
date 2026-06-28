import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl font-black tracking-tight"
    >
      <span className="text-blue-500">Project</span>{" "}
      <span className="gradient-text">TITAN</span>
    </Link>
  );
}