import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { Container } from "@/components/layout/Container";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
     <Container className="flex h-16 items-center justify-between">
        <Logo />
        <NavLinks />
      </Container>
    </header>
    
  );
}