export type ResearchReconciliationObligationStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Abandoned"
  | "Superseded";

const RESEARCH_RECONCILIATION_OBLIGATION_TRANSITIONS: Record<
  ResearchReconciliationObligationStatus,
  ResearchReconciliationObligationStatus[]
> = {
  Open: ["In Progress", "Abandoned", "Superseded"],
  "In Progress": ["Resolved", "Abandoned", "Superseded"],
  Resolved: [],
  Abandoned: [],
  Superseded: [],
};

export function canTransitionResearchReconciliationObligation(
  from: ResearchReconciliationObligationStatus,
  to: ResearchReconciliationObligationStatus,
): boolean {
  if (from === to) {
    return true;
  }

  return RESEARCH_RECONCILIATION_OBLIGATION_TRANSITIONS[from]?.includes(to) ?? false;
}
