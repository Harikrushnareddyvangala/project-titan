import { Hero } from "@/features/home/components/Hero/Hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { Badge } from "@/components/ui";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Hero />

      <section className="mx-auto mt-20 max-w-4xl px-6">
        <Card variant="glass" hover>
          <CardHeader>
            <CardTitle>Enterprise Card System</CardTitle>
            <CardDescription>
              This card will be reused throughout Project TITAN.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p>
              The Card component supports variants, hover effects, and composable
              sections.
            </p>
          </CardContent>

          <CardFooter>
            <Button>Explore</Button>
          </CardFooter>
        </Card>

        <div className="mt-10 flex flex-wrap gap-3">
  <Badge>Python</Badge>

  <Badge variant="success">
    Machine Learning
  </Badge>

  <Badge variant="warning">
    Power BI
  </Badge>

  <Badge variant="outline">
    Docker
  </Badge>

  <Badge variant="destructive">
    Deprecated
  </Badge>
</div>
      </section>
    </main>
  );
}