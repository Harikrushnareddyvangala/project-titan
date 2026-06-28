import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";

export function HeroActions() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      <Link href="/projects">
        <Button size="lg">
          View Projects
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>

      <Link href="/resume.pdf">
        <Button variant="outline" size="lg">
          <Download className="mr-2 h-5 w-5" />
          Download Resume
        </Button>
      </Link>
    </div>
  );
}