"use client";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

import { useIntelligenceSnapshot } from "@/hooks/useIntelligenceSnapshot";

import { IntelligenceNavigation } from "./navigation";
import {
  IntelligenceSection,
} from "./shared";
import { IntelligenceOverview } from "./overview";
import { IntelligenceSearch } from "./search";
import { IntelligenceActionBar } from "./actions";
import {
  IntelligenceSnapshotHistory,
} from "./snapshots";
import {
  SharedSnapshotView,
} from "./snapshots/SharedSnapshotView";
import {
  useSharedSnapshot,
} from "@/hooks/useSharedSnapshot";

import { ExecutiveIntelligence } from "./executive";
import { EngineeringIntelligence } from "./engineering";
import { TechnologyIntelligence } from "./technology";
import { DevelopmentIntelligence } from "./development";
import { EnterpriseIntelligence } from "./enterprise";
import { RecruiterIntelligence } from "./recruiter";
import { AIRecommendations } from "./recommendations";

interface RepositoryIntelligenceProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics;
}

export function RepositoryIntelligence({
  repository,
  analytics,
}: RepositoryIntelligenceProps) {
  const {
    createSnapshot,
    snapshotCreated,
  } = useIntelligenceSnapshot();
  const sharedSnapshot = useSharedSnapshot();

  return (
    <section className="space-y-10">
      {/* =====================================================
          Intelligence Header
      ====================================================== */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Repository Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Engineering Intelligence
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          A consolidated intelligence layer for understanding
          repository quality, engineering maturity, technology,
          development practices, enterprise readiness, recruiter
          signals, and actionable recommendations.
        </p>
      </div>
      {sharedSnapshot ? (
  <SharedSnapshotView />
) : null}

      {/* =====================================================
          Intelligence Navigation
      ====================================================== */}
      <IntelligenceNavigation
        analytics={analytics}
      />

      {/* =====================================================
          Intelligence Search
      ====================================================== */}
      <IntelligenceSearch
        analytics={analytics}
      />

      {/* =====================================================
          Intelligence Actions
      ====================================================== */}
      <IntelligenceActionBar
        onSnapshot={() =>
          createSnapshot(
            repository.full_name,
            analytics,
          )
        }
      />

      {snapshotCreated ? (
        <p
          role="status"
          className="text-sm font-medium text-cyan-300"
        >
          Intelligence snapshot saved.
        </p>
      ) : null}

      {/* =====================================================
          Intelligence Overview
      ====================================================== */}
      <IntelligenceOverview
        analytics={analytics}
      />

      {/* =====================================================
          Executive Intelligence
      ====================================================== */}
      <IntelligenceSection id="executive">
        <ExecutiveIntelligence
          repository={repository}
          analytics={analytics}
        />
      </IntelligenceSection>

      {/* =====================================================
          Engineering Intelligence
      ====================================================== */}
      <IntelligenceSection id="engineering">
        <EngineeringIntelligence
          analytics={analytics}
        />
      </IntelligenceSection>

      {/* =====================================================
          Technology Intelligence
      ====================================================== */}
      <IntelligenceSection id="technology">
        <TechnologyIntelligence
          analytics={analytics}
        />
      </IntelligenceSection>

      {/* =====================================================
          Development Intelligence
      ====================================================== */}
      <IntelligenceSection id="development">
        <DevelopmentIntelligence
          analytics={analytics}
        />
      </IntelligenceSection>

      {/* =====================================================
          Enterprise Intelligence
      ====================================================== */}
      <IntelligenceSection id="enterprise">
        <EnterpriseIntelligence
          analytics={analytics}
        />
      </IntelligenceSection>

      {/* =====================================================
          Recruiter Intelligence
      ====================================================== */}
      {analytics.recruiterIntelligence ? (
        <IntelligenceSection id="recruiter">
          <RecruiterIntelligence
            recruiterIntelligence={
              analytics.recruiterIntelligence
            }
          />
        </IntelligenceSection>
      ) : null}

      {/* =====================================================
          AI Recommendations
      ====================================================== */}
      <IntelligenceSection id="recommendations">
        <AIRecommendations
          analytics={analytics}
        />
      </IntelligenceSection>

      {/* =====================================================
          Intelligence Snapshot History
      ====================================================== */}
      <IntelligenceSnapshotHistory
      />
    </section>
  );
}