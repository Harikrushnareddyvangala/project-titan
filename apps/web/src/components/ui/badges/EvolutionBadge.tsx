import type {
  EvolutionDirection,
} from "@/types/intelligence";

import { StatusBadge } from "./StatusBadge";

interface EvolutionBadgeProps {

  direction: EvolutionDirection;

}

export function EvolutionBadge({

  direction,

}: EvolutionBadgeProps) {

  const variant =
    direction === "Rapidly Improving"
      ? "success"
      : direction === "Improving"
      ? "info"
      : direction === "Stable"
      ? "neutral"
      : direction === "Declining"
      ? "warning"
      : "danger";

  return (

    <StatusBadge
      variant={variant}
    >

      {direction}

    </StatusBadge>

  );

}