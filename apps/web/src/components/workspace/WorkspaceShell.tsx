import { WorkspaceHero } from "./WorkspaceHero";
import { WorkspaceNavigation } from "./WorkspaceNavigation";

export function WorkspaceShell() {
  return (
    <div className="mx-auto max-w-7xl p-10">
      <WorkspaceHero />
      <WorkspaceNavigation />
    </div>
  );
}