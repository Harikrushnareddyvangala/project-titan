import {
    createResearchInvestigationRecord,
    getResearchInvestigationRecord,
} from "@titan/database";
import type { ResearchInvestigation } from "@/types/research";

type ResearchInvestigationInput = Pick<
    ResearchInvestigation,
    "id" | "title" | "objective" | "question" | "status"
> &
    Partial<
        Pick<
            ResearchInvestigation,
            "description" | "repository"
        >
    > & {
        createdAt: string;
        updatedAt: string;
    };

function toDate(value: string): Date {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid investigation timestamp: ${value}`);
    }

    return date;
}

function mapResearchInvestigationRecord(
    record: Awaited<
        ReturnType<typeof getResearchInvestigationRecord>
    >,
): ResearchInvestigation | null {
    if (!record) {
        return null;
    }

    return {
        id: record.id,
        title: record.title,
        objective: record.objective,
        question: record.question,
        status: record.status as ResearchInvestigation["status"],
        description: record.description ?? undefined,
        repository: record.repository ?? undefined,
        experimentIds: record.experimentIds,
        evidenceIds: record.evidenceIds,
        findingIds: record.findingIds,
        artifactIds: record.artifactIds,
        conclusionIds: record.conclusionIds,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    };
}

export async function getResearchInvestigation(
    id: string,
): Promise<ResearchInvestigation | null> {
    const record = await getResearchInvestigationRecord(id);

    return mapResearchInvestigationRecord(record);
}

export async function createResearchInvestigation(
    investigation: ResearchInvestigationInput,
): Promise<ResearchInvestigation> {
    const record = await createResearchInvestigationRecord({
        id: investigation.id,
        title: investigation.title,
        objective: investigation.objective,
        question: investigation.question,
        status: investigation.status,
        description: investigation.description,
        repository: investigation.repository,
        createdAt: toDate(investigation.createdAt),
        updatedAt: toDate(investigation.updatedAt),
    });

    return mapResearchInvestigationRecord(record)!;
}
