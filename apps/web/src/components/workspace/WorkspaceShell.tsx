import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceHero } from "./WorkspaceHero";
import { WorkspaceNavigation } from "./WorkspaceNavigation";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

export function WorkspaceShell() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
      <WorkspaceHeader />

      <div className="mt-10 grid gap-8 xl:grid-cols-[320px_1fr]">
        <div className="hidden xl:block">
          <WorkspaceSidebar />
        </div>

        <div className="space-y-10">
          <WorkspaceHero />
          <WorkspaceNavigation />
        </div>
      </div>
    </div>
  );
}