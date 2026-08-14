"use client";

import {
    CheckCircle2,
    Plus,
    Trash2,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";

import {
    attachResearchInvestigationConclusion,
    createResearchInvestigationConclusion,
    detachResearchInvestigationConclusion,
    evaluateResearchInvestigationConclusionAcceptance,
    getResearchFindings,
    getResearchInvestigationConclusions,
    transitionResearchInvestigationConclusion,
} from "@/lib/research";

import type {
    ResearchConclusionStatus,
    ResearchFinding,
    ResearchInvestigation,
    ResearchInvestigationConclusion,
} from "@/types/research";

interface ResearchConclusionPanelProps {
    investigation: ResearchInvestigation;

    onInvestigationUpdated?: (
        investigation: ResearchInvestigation,
    ) => void;
}

export function ResearchConclusionPanel({
    investigation,
    onInvestigationUpdated,
}: ResearchConclusionPanelProps) {
    const [statement, setStatement] =
        useState("");

    const [supportingFindingIds, setSupportingFindingIds] =
        useState<string[]>([]);

    const [contradictingFindingIds, setContradictingFindingIds] =
        useState<string[]>([]);

    const [uncertainty, setUncertainty] =
        useState("");

    const [nextAction, setNextAction] =
        useState("");

    const [conclusionRefreshKey, setConclusionRefreshKey] =
        useState(0);

    const findings = useMemo(() => {
        const stored =
            getResearchFindings();

        return stored.filter(
            (finding) =>
                investigation.findingIds.includes(
                    finding.id,
                ),
        );
    }, [investigation.findingIds]);

    const conclusions = useMemo(() => {
        const stored =
            getResearchInvestigationConclusions();

        return stored.filter(
            (conclusion) =>
                investigation.conclusionIds.includes(
                    conclusion.id,
                ),
        );
    }, [
        investigation.conclusionIds,
    ]);

    function toggleFinding(
        findingId: string,
        relationship:
            | "supporting"
            | "contradicting",
    ) {
        if (
            relationship === "supporting"
        ) {
            setSupportingFindingIds(
                (current) =>
                    current.includes(findingId)
                        ? current.filter(
                            (id) =>
                                id !== findingId,
                        )
                        : [
                            ...current,
                            findingId,
                        ],
            );

            setContradictingFindingIds(
                (current) =>
                    current.filter(
                        (id) =>
                            id !== findingId,
                    ),
            );

            return;
        }

        setContradictingFindingIds(
            (current) =>
                current.includes(findingId)
                    ? current.filter(
                        (id) =>
                            id !== findingId,
                    )
                    : [
                        ...current,
                        findingId,
                    ],
        );

        setSupportingFindingIds(
            (current) =>
                current.filter(
                    (id) =>
                        id !== findingId,
                ),
        );
    }

    function createConclusion() {
        const cleanStatement =
            statement.trim();

        if (!cleanStatement) {
            return;
        }

        const conclusion =
            createResearchInvestigationConclusion(
                {
                    investigationId:
                        investigation.id,

                    statement:
                        cleanStatement,

                    status:
                        "Draft" as ResearchConclusionStatus,

                    supportingFindingIds,

                    contradictingFindingIds,

                    uncertainty:
                        uncertainty.trim() ||
                        undefined,

                    nextAction:
                        nextAction.trim() ||
                        undefined,
                },
            );

        const updatedInvestigation =
            attachResearchInvestigationConclusion(
                investigation.id,
                conclusion.id,
            );

        if (updatedInvestigation) {
            onInvestigationUpdated?.(
                updatedInvestigation,
            );
        }

        setStatement("");
        setSupportingFindingIds([]);
        setContradictingFindingIds([]);
        setUncertainty("");
        setNextAction("");
    }

    function removeConclusion(
        conclusionId: string,
    ) {
        const updatedInvestigation =
            detachResearchInvestigationConclusion(
                investigation.id,
                conclusionId,
            );

        if (updatedInvestigation) {
            onInvestigationUpdated?.(
                updatedInvestigation,
            );
        }
    }

    return (
        <section className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                        Research Conclusions
                    </p>

                    <h4 className="mt-1 text-lg font-bold text-white">
                        Investigation Conclusions
                    </h4>
                </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
                Synthesize validated findings into explicit
                research conclusions while preserving
                uncertainty and contradictory evidence.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    New Conclusion
                </p>

                <textarea
                    value={statement}
                    onChange={(event) =>
                        setStatement(
                            event.target.value,
                        )
                    }
                    rows={3}
                    placeholder="Conclusion statement..."
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-400/40"
                />

                <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                        Findings
                    </p>

                    {findings.length === 0 ? (
                        <div className="mt-3 rounded-2xl border border-dashed border-white/10 p-4 text-center">
                            <p className="text-xs text-zinc-600">
                                No findings are available for
                                this investigation.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-3 space-y-2">
                            {findings.map(
                                (finding) => (
                                    <FindingSelector
                                        key={finding.id}
                                        finding={finding}
                                        supporting={
                                            supportingFindingIds.includes(
                                                finding.id,
                                            )
                                        }
                                        contradicting={
                                            contradictingFindingIds.includes(
                                                finding.id,
                                            )
                                        }
                                        onSupporting={() =>
                                            toggleFinding(
                                                finding.id,
                                                "supporting",
                                            )
                                        }
                                        onContradicting={() =>
                                            toggleFinding(
                                                finding.id,
                                                "contradicting",
                                            )
                                        }
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>

                <textarea
                    value={uncertainty}
                    onChange={(event) =>
                        setUncertainty(
                            event.target.value,
                        )
                    }
                    rows={3}
                    placeholder="Remaining uncertainty, limitations, or unresolved questions..."
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-400/40"
                />

                <textarea
                    value={nextAction}
                    onChange={(event) =>
                        setNextAction(
                            event.target.value,
                        )
                    }
                    rows={2}
                    placeholder="Recommended next research or engineering action..."
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-400/40"
                />

                <button
                    type="button"
                    disabled={
                        !statement.trim()
                    }
                    onClick={
                        createConclusion
                    }
                    className="mt-4 inline-flex items-center rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Plus className="mr-2 h-4 w-4" />

                    Create Conclusion
                </button>
            </div>

            <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    Recorded Conclusions
                </p>

                {conclusions.length === 0 ? (
                    <div className="mt-3 rounded-2xl border border-dashed border-white/10 p-5 text-center">
                        <p className="text-sm text-zinc-600">
                            No conclusions recorded for
                            this investigation.
                        </p>
                    </div>
                ) : (
                    <div className="mt-3 space-y-3">
                        {conclusions.map(
                            (conclusion) => (
                                <ConclusionCard
                                    key={conclusion.id}
                                    conclusion={
                                        conclusion
                                    }
                                    onDelete={() =>
                                        removeConclusion(
                                            conclusion.id,
                                        )
                                    }
                                    onInvestigationUpdated={
                                        (_updatedConclusion) => {
                                            onInvestigationUpdated?.({
                                                ...investigation,

                                                conclusionIds: [
                                                    ...investigation.conclusionIds,
                                                ],

                                                updatedAt:
                                                    new Date().toISOString(),
                                            });
                                        }
                                    }
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

interface FindingSelectorProps {
    finding: ResearchFinding;

    supporting: boolean;

    contradicting: boolean;

    onSupporting: () => void;

    onContradicting: () => void;
}

function FindingSelector({
    finding,
    supporting,
    contradicting,
    onSupporting,
    onContradicting,
}: FindingSelectorProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-sm font-semibold text-white">
                {finding.statement}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={onSupporting}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${supporting
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 text-zinc-500 hover:text-zinc-300"
                        }`}
                >
                    Supporting
                </button>

                <button
                    type="button"
                    onClick={onContradicting}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${contradicting
                        ? "border-red-400/40 bg-red-500/10 text-red-300"
                        : "border-white/10 text-zinc-500 hover:text-zinc-300"
                        }`}
                >
                    Contradicting
                </button>
            </div>
        </div>
    );
}

interface ConclusionCardProps {
    conclusion: ResearchInvestigationConclusion;

    onDelete: () => void;
    onInvestigationUpdated: (
        conclusion: ResearchInvestigationConclusion,
    ) => void;
}

function ConclusionCard({
    conclusion,
    onDelete,
    onInvestigationUpdated,
}: ConclusionCardProps) {
    const acceptance =
        evaluateResearchInvestigationConclusionAcceptance(
            conclusion,
        );
    function transition(
        to: ResearchConclusionStatus,
    ) {
        const updated =
            transitionResearchInvestigationConclusion(
                conclusion,
                to,
            );

        if (!updated) {
            return;
        }

        onInvestigationUpdated(
            updated,
        );
    }
    return (
        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-base font-bold text-white">
                            {conclusion.statement}
                        </h5>

                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                            {conclusion.status}
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
                            Supporting:{" "}
                            {
                                conclusion
                                    .supportingFindingIds
                                    .length
                            }
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
                            Contradicting:{" "}
                            {
                                conclusion
                                    .contradictingFindingIds
                                    .length
                            }
                        </span>
                    </div>
                    {conclusion.status === "Draft" && (
                        <button
                            type="button"
                            onClick={() =>
                                transition("Proposed")
                            }
                            className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
                        >
                            Propose Conclusion
                        </button>
                    )}

                    {conclusion.status === "Proposed" && (
                        <div className="mt-4">
                            <button
                                type="button"
                                disabled={!acceptance.eligible}
                                onClick={() =>
                                    transition("Accepted")
                                }
                                className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Accept Conclusion
                            </button>

                            {!acceptance.eligible && (
                                <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/5 p-3">
                                    <p className="text-xs font-semibold text-amber-300">
                                        Acceptance requirements
                                    </p>

                                    <ul className="mt-2 space-y-1">
                                        {acceptance.reasons.map(
                                            (reason) => (
                                                <li
                                                    key={reason}
                                                    className="text-xs leading-5 text-zinc-500"
                                                >
                                                    • {reason}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {conclusion.uncertainty && (
                        <p className="mt-3 text-xs leading-5 text-zinc-500">
                            Uncertainty:{" "}
                            {conclusion.uncertainty}
                        </p>
                    )}

                    {conclusion.nextAction && (
                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                            Next action:{" "}
                            {conclusion.nextAction}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`Remove ${conclusion.statement}`}
                    className="rounded-xl border border-white/10 p-2 text-zinc-600 transition hover:border-red-400/30 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </article>
    );
}