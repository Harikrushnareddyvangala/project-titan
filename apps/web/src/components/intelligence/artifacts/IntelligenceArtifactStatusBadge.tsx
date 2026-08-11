import type {
  IntelligenceArtifactStatus,
} from "@/types/intelligence";



interface IntelligenceArtifactStatusBadgeProps {
  status: IntelligenceArtifactStatus;
}

export function IntelligenceArtifactStatusBadge({
  status,
}: IntelligenceArtifactStatusBadgeProps) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-zinc-300">
      {status}
    </span>
  );
}