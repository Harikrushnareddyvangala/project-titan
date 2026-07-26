"use client";

import { GithubAnalyticsSection } from "@/components/sections/Projects/ProjectModal/GithubAnalyticsSection";
import { useGithubRepository } from "@/hooks/useGithubRepository";

interface ComparisonRepositoryAnalyticsProps {
    repository: string;
}

export function ComparisonRepositoryAnalytics({
    repository,
}: ComparisonRepositoryAnalyticsProps) {
    const github = useGithubRepository(repository);

    return (
        <GithubAnalyticsSection
            {...github}
        />
    );
}