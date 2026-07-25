"use client";

interface Props {
  repoName: string;
  onRepoNameChange: (value: string) => void;
  onSubmit: () => void;
}

export function RepositoryWorkspaceHeader({
  repoName,
  onRepoNameChange,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
        Project TITAN
      </p>

      <h1 className="mt-5 text-4xl font-black text-white md:text-5xl">
        Repository Intelligence
      </h1>

      <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
        Analyze a single GitHub repository with TITAN’s engineering, security,
        contributor, commit, benchmark, and executive intelligence layers.
      </p>

      <form
        className="mt-8 flex flex-col gap-4 md:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          value={repoName}
          onChange={(event) => onRepoNameChange(event.target.value)}
          placeholder="owner/repository"
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-black/40
            px-5
            py-3
            text-white
            outline-none
            placeholder:text-zinc-500
            focus:border-cyan-400/60
          "
        />

        <button
          type="submit"
          className="
            rounded-2xl
            border
            border-cyan-400/40
            bg-cyan-500/10
            px-6
            py-3
            font-semibold
            text-cyan-300
            transition
            hover:bg-cyan-500/20
          "
        >
          Analyze Repository
        </button>
      </form>
    </section>
  );
}