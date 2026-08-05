import { BaseCard } from "@/components/ui";

interface RecommendationCardProps {

  title: string;

  description: string;

}

export function RecommendationCard({

  title,

  description,

}: RecommendationCardProps) {

  return (

    <BaseCard

      title={title}

      variant="default"

    >

      <p className="text-sm leading-7 text-zinc-300">

        {description}

      </p>

    </BaseCard>

  );

}