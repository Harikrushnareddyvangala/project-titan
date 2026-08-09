"use client";

import { Download, Printer } from "lucide-react";
import Image from "next/image";

import type { IntelligenceSnapshot } from "@/types/intelligence";

interface IntelligenceReportProps {
  snapshot: IntelligenceSnapshot;
  onClose: () => void;
}

export function IntelligenceReport({
  snapshot,
  onClose,
}: IntelligenceReportProps) {
    const generatedAt = new Date();

  const generatedAtText =
    generatedAt.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
 const handlePrint = async () => {
  const report =
    document.getElementById(
      "titan-intelligence-report",
    );

  if (!report) {
    window.print();
    return;
  }

  const images =
    Array.from(
      report.querySelectorAll("img"),
    );

  await Promise.all(
    images.map((image) => {
      if (
        image.complete &&
        image.naturalWidth > 0
      ) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const timeout =
          window.setTimeout(
            resolve,
            2000,
          );

        image.addEventListener(
          "load",
          () => {
            window.clearTimeout(timeout);
            resolve();
          },
          { once: true },
        );

        image.addEventListener(
          "error",
          () => {
            window.clearTimeout(timeout);
            resolve();
          },
          { once: true },
        );
      });
    }),
  );

  window.setTimeout(
    () => window.print(),
    100,
  );
};

  return (
    <section
      id="titan-intelligence-report"
      className="rounded-3xl border border-white/10 bg-black/20 p-6 md:p-8 print:rounded-none print:border-0 print:bg-white print:p-0"
    >
      {/* Header */}
      <header className="border-b border-white/10 pb-6 print:border-black/10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 print:text-black">
          TITAN Intelligence Report
        </p>

        <h2 className="mt-3 text-3xl font-black text-white print:text-black md:text-4xl">
          Repository Intelligence Report
        </h2>

        <p className="mt-3 break-words text-lg font-semibold text-zinc-300 print:text-black">
          {snapshot.repository}
        </p>

        <p className="mt-2 text-sm text-zinc-500 print:text-zinc-600">
          Snapshot created{" "}
          {new Date(
            snapshot.createdAt,
          ).toLocaleString()}
        </p>
      </header>

      {/* Executive Summary */}
      <section className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 print:text-black">
          Executive Summary
        </p>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-400 print:text-zinc-700">
          This report summarizes the repository
          intelligence captured at the time this
          snapshot was created. The report is generated
          directly from the preserved intelligence
          snapshot.
        </p>
      </section>

      {/* Core Metrics */}
      <section className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-2">
          <ReportMetric
            label="Enterprise Readiness"
            value={
              snapshot.analytics
                .enterpriseReadiness
            }
          />

          <ReportMetric
            label="Security Score"
            value={
              snapshot.analytics
                .securityScore
            }
          />

          <ReportMetric
            label="Dependency Risk"
            value={
              snapshot.analytics
                .dependencyRisk
            }
          />

          <ReportMetric
            label="Production Score"
            value={
              snapshot.analytics
                .productionScore
            }
          />
        </div>
      </section>

      {/* Metadata */}
      <section className="mt-8 grid gap-4 md:grid-cols-2 print:grid-cols-2">
  <ReportMetadata
    label="Snapshot ID"
    value={snapshot.id}
  />

  <ReportMetadata
    label="Repository"
    value={snapshot.repository}
  />

  <ReportMetadata
    label="Snapshot Created"
    value={new Date(
      snapshot.createdAt,
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: "Asia/Kolkata",
    })}
  />

  <ReportMetadata
    label="Report Generated"
    value={`${generatedAtText} IST`}
  />

  <ReportMetadata
    label="Report Source"
    value="Intelligence Snapshot"
  />
</section>

 {/* =====================================================
    Author Signature - Print Only
====================================================== */}
<section className="mt-12 hidden border-t border-white/10 pt-8 print:block print:border-black/10">
  <div className="flex flex-col">
    <img
      src="/branding/harikrushnareddy-signature-transparent.png"
      alt="Harikrushnareddy signature"
      width={1378}
      height={283}
      loading="eager"
      className="titan-report-image h-20 w-auto max-w-[320px] object-contain object-left"
    />

    <p className="mt-2 text-sm font-semibold text-black">
      Harikrushnareddy
    </p>

    <p className="mt-1 text-xs text-zinc-600">
      Researcher · Data Scientist · AI Systems Research
    </p>

    <p className="mt-1 text-xs text-zinc-500">
      TITAN Intelligence System
    </p>
  </div>
</section>

      {/* Actions */}
      <footer className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <p className="text-xs text-zinc-600">
          Generated by TITAN Repository Intelligence.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            Close Report
          </button>
        </div>
      </footer>
    </section>
  );
}

interface ReportMetricProps {
  label: string;
  value: unknown;
}

function ReportMetric({
  label,
  value,
}: ReportMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 print:border-black/10 print:bg-white">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 print:text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white print:text-black">
        {value == null
          ? "—"
          : String(value)}
      </p>
    </div>
  );
}

interface ReportMetadataProps {
  label: string;
  value: string;
}

function ReportMetadata({
  label,
  value,
}: ReportMetadataProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 print:border-black/10 print:bg-white">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 print:text-zinc-600">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-zinc-200 print:text-black">
        {value}
      </p>
    </div>
  );
}