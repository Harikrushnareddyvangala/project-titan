import { Button } from "@/components/ui";

export function HeroButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button size="lg">
        View Projects
      </Button>

      <Button
        variant="outline"
        size="lg"
      >
        Download Resume
      </Button>
    </div>
  );
}