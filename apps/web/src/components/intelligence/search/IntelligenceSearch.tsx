"use client";

import { Check, Copy, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { RepositoryAnalytics } from "@/types/github";

import { getAvailableIntelligenceSections } from "../shared";

interface IntelligenceSearchProps {
  analytics: RepositoryAnalytics;
}

export function IntelligenceSearch({
  analytics,
}: IntelligenceSearchProps) {
  const [query, setQuery] = useState("");
  const [copiedSection, setCopiedSection] =
    useState<string | null>(null);

  const availableSections = useMemo(
    () =>
      getAvailableIntelligenceSections(
        analytics,
      ),
    [analytics],
  );

  const results = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return availableSections.filter(
      (section) =>
        section.title
          .toLowerCase()
          .includes(normalizedQuery) ||
        section.id
          .toLowerCase()
          .includes(normalizedQuery) ||
        section.description
          ?.toLowerCase()
          .includes(normalizedQuery),
    );
  }, [availableSections, query]);

  const handleSelect = (sectionId: string) => {
    const element = document.getElementById(
      `intelligence-${sectionId}`,
    );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(
      null,
      "",
      `#${sectionId}`,
    );

    setQuery("");
  };

  const handleCopyLink = async (
    sectionId: string,
  ) => {
    const url = new URL(
      window.location.href,
    );

    url.hash = sectionId;

    try {
      await navigator.clipboard.writeText(
        url.toString(),
      );

      setCopiedSection(sectionId);

      window.setTimeout(() => {
        setCopiedSection(null);
      }, 1500);
    } catch {
      setCopiedSection(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition focus-within:border-cyan-400/30 focus-within:bg-white/[0.05]">
        <Search className="h-4 w-4 shrink-0 text-zinc-500" />

        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search intelligence..."
          aria-label="Search repository intelligence"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        />

        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-xs font-semibold text-zinc-500 transition hover:text-white"
          >
            Clear
          </button>
        ) : null}
      </div>

      {query.trim() ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[60vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">         {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((section) => (
                <div
                  key={section.id}
                  className="group flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-white/[0.06]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(section.id)
                    }
                    className="min-w-0 flex-1 px-1 py-1 text-left"
                  >
                    <p className="truncate text-sm font-semibold text-white">
                      {section.title}
                    </p>

                    {section.description ? (
                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {section.description}
                      </p>
                    ) : null}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyLink(section.id)
                    }
                    aria-label={`Copy link to ${section.title}`}
                    title="Copy section link"
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.06] hover:text-cyan-300"
                  >
                    {copiedSection === section.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-sm font-semibold text-zinc-400">
                No intelligence section found.
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Try executive, engineering, technology,
                development, enterprise, recruiter, or
                recommendations.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}