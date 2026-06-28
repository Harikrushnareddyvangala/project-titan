import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
     <div className="container flex h-16 items-center justify-between">
        <Logo />
        <NavLinks />
      </div>
    </header>
    
  );
}