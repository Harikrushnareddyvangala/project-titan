"use client";

export function AboutHeader() {
  return (
    <div className="max-w-3xl">
      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400">
        ABOUT
      </span>

      <h2 className="mt-6 text-5xl font-black text-white">
        Building Intelligent Systems
        <br />
        Through Data
      </h2>

      <p className="mt-6 text-lg leading-8 text-zinc-400">
        I specialize in transforming raw data into
        business intelligence, predictive models,
        and AI-powered applications using modern
        cloud-native technologies.
      </p>
    </div>
  );
}