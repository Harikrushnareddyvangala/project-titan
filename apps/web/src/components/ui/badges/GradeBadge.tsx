import { StatusBadge } from "./StatusBadge";
import type {
  RepositoryGrade,
} from "@/types/intelligence";

interface GradeBadgeProps {
  grade: RepositoryGrade;
}

export function GradeBadge({
  grade,
}: GradeBadgeProps) {
  const variant =
    grade === "A+"
      ? "success"
      : grade === "A"
      ? "success"
      : grade === "B"
      ? "info"
      : grade === "C"
      ? "warning"
      : "danger";

  return (
    <StatusBadge variant={variant}>
      {grade}
    </StatusBadge>
  );
}