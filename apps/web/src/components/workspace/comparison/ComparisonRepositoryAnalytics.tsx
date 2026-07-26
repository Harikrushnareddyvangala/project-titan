"use client";

import { GithubAnalyticsSection } from "@/components/sections/Projects/ProjectModal/GithubAnalyticsSection";
import { useGithubRepository } from "@/hooks/useGithubRepository";
import { useEffect } from "react";
import type { RepositoryAnalytics } from "@/types/github";

interface ComparisonRepositoryAnalyticsProps {
    repository: string;
    onAnalyticsLoaded: (
        repository: string,
        analytics: RepositoryAnalytics,
    ) => void;
}

export function ComparisonRepositoryAnalytics({
    repository,
    onAnalyticsLoaded,
}: ComparisonRepositoryAnalyticsProps) {
    const github = useGithubRepository(repository);
    useEffect(() => {
    if (!github.analytics) {
        return;
    }

    onAnalyticsLoaded(repository, github.analytics);
}, [repository, github.analytics, onAnalyticsLoaded]);

    return (
        <GithubAnalyticsSection
            {...github}
        />
    );
}