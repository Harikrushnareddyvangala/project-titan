"use client";

import { useEffect, useMemo, useState } from "react";

import type { RepositoryAnalytics } from "@/types/github";

import { getAvailableIntelligenceSections } from "../shared";

import { IntelligenceNavigationItem } from "./IntelligenceNavigationItem";

interface IntelligenceNavigationProps {
  analytics: RepositoryAnalytics;
}

export function IntelligenceNavigation({
  analytics,
}: IntelligenceNavigationProps) {
  const availableSections = useMemo(
  () =>
    getAvailableIntelligenceSections(analytics),
  [analytics],
);

  type IntelligenceSectionId =
    (typeof availableSections)[number]["id"];

  const [activeSection, setActiveSection] =
    useState<IntelligenceSectionId>(
      availableSections[0]?.id ?? "executive",
    );

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    const matchingSection = availableSections.find(
      (section) => section.id === hash,
    );

    if (!matchingSection) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setActiveSection(matchingSection.id);

      const element = document.getElementById(
        `intelligence-${matchingSection.id}`,
      );

      element?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [analytics, availableSections]);

  useEffect(() => {
    if (availableSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio,
          );

        const visibleEntry = visibleEntries[0];

        if (!visibleEntry) {
          return;
        }

        const sectionId =
          visibleEntry.target.getAttribute(
            "data-intelligence-section",
          );

        if (!sectionId) {
          return;
        }

        const matchingSection = availableSections.find(
          (section) => section.id === sectionId,
        );

        if (!matchingSection) {
          return;
        }

        setActiveSection(matchingSection.id);

        window.history.replaceState(
          null,
          "",
          `#${matchingSection.id}`,
        );
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    availableSections.forEach((section) => {
      const element = document.getElementById(
        `intelligence-${section.id}`,
      );

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [availableSections]);

  const handleNavigation = (
    sectionId: IntelligenceSectionId,
  ) => {
    const element = document.getElementById(
      `intelligence-${sectionId}`,
    );

    if (!element) {
      return;
    }

    setActiveSection(sectionId);

    window.history.replaceState(
      null,
      "",
      `#${sectionId}`,
    );

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (availableSections.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Repository intelligence sections"
      className="sticky top-3 z-30 rounded-2xl border border-white/10 bg-zinc-950/85 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl md:top-4 md:p-2"
    >
      <div className="flex gap-1 overflow-x-auto overscroll-x-contain px-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {availableSections.map((section) => (
          <IntelligenceNavigationItem
            key={section.id}
            section={section}
            active={activeSection === section.id}
            onClick={() =>
              handleNavigation(section.id)
            }
          />
        ))}
      </div>
    </nav>
  );
}