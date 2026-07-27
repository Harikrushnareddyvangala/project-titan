"use client";

import type { RankedRepository } from "@/types/github";

interface RepositoryRankingTableProps {
  rankings: RankedRepository[];
  selectedRepository: RankedRepository;
  onRepositorySelect: (repository: RankedRepository) => void;
}

export function RepositoryRankingTable({
  rankings,
  selectedRepository,
  onRepositorySelect,
}: RepositoryRankingTableProps) {
  return (
    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl">
      <div className="border-b border-white/10 p-8">
        <h3 className="text-2xl font-bold text-white">
          Repository Rankings
        </h3>

        <p className="mt-2 text-zinc-400">
          Overall engineering ranking calculated using weighted engineering,
          security, production, enterprise, and hiring readiness metrics.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <HeaderCell>Rank</HeaderCell>
              <HeaderCell>Repository</HeaderCell>
              <HeaderCell>Overall</HeaderCell>
              <HeaderCell>Engineering</HeaderCell>
              <HeaderCell>Security</HeaderCell>
              <HeaderCell>Production</HeaderCell>
              <HeaderCell>Enterprise</HeaderCell>
              <HeaderCell>Hiring</HeaderCell>
              <HeaderCell>Grade</HeaderCell>
            </tr>
          </thead>

          <tbody>
            {rankings.map((repository) => (
              <tr
  key={repository.repositoryName}
  onClick={() => onRepositorySelect(repository)}
  className={`cursor-pointer border-t border-white/10 transition-all duration-200
    ${
      selectedRepository.repositoryName === repository.repositoryName
        ? "bg-cyan-500/20 ring-1 ring-cyan-400"
        : repository.rank === 1
        ? "bg-yellow-500/10 hover:bg-yellow-500/15"
        : repository.rank === 2
        ? "bg-zinc-300/5 hover:bg-zinc-300/10"
        : repository.rank === 3
        ? "bg-orange-500/10 hover:bg-orange-500/15"
        : "hover:bg-white/5"
    }`}
>
                <BodyCell>
                  {repository.medal || repository.rank}
                </BodyCell>

                <BodyCell>
  <div className="flex items-center gap-3">

    {selectedRepository.repositoryName === repository.repositoryName && (
      <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
    )}

    <span>{repository.repositoryName}</span>

  </div>
</BodyCell>

                <BodyCell>
  <span
    className={
      selectedRepository.repositoryName === repository.repositoryName
        ? "font-bold text-cyan-300"
        : ""
    }
  >
    {repository.overallScore.toFixed(1)}
  </span>
</BodyCell>

                <BodyCell>
                  {repository.engineeringScore}
                </BodyCell>

                <BodyCell>
                  {repository.securityScore}
                </BodyCell>

                <BodyCell>
                  {repository.productionScore}
                </BodyCell>

                <BodyCell>
                  {repository.enterpriseReadiness}
                </BodyCell>

                <BodyCell>
                  {repository.hiringScore}
                </BodyCell>

                <BodyCell>
                  {repository.repositoryGrade}
                </BodyCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface HeaderCellProps {
  children: React.ReactNode;
}

function HeaderCell({
  children,
}: HeaderCellProps) {
  return (
    <th className="px-6 py-4 text-left text-sm uppercase tracking-[0.25em] text-zinc-400">
      {children}
    </th>
  );
}

interface BodyCellProps {
  children: React.ReactNode;
}

function BodyCell({
  children,
}: BodyCellProps) {
  return (
    <td className="px-6 py-5 text-white">
      {children}
    </td>
  );
}