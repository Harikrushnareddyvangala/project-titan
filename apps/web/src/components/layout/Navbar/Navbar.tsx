import { DesktopNav } from "./DesktopNav";
import { Logo } from "./Logo";
import { NavbarRight } from "./navbar-right";

export function Navbar() {
  return (
    <header className="h-20 border-b border-zinc-800">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Logo />

        <DesktopNav />

        <NavbarRight />
      </div>
    </header>
  );
}