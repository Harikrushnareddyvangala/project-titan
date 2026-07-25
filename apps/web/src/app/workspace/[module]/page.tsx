import { notFound } from "next/navigation";

import { WorkspaceModulePage } from "@/components/workspace/WorkspaceModulePage";
import { workspaceNavigation } from "@/lib/constants/workspaceNavigation";

interface Props {
  params: {
    module: string;
  };
}

export default function WorkspaceDynamicModulePage({ params }: Props) {
  const workspaceModule = workspaceNavigation.find((item) =>
    item.href.endsWith(`/${params.module}`),
  );

  if (!workspaceModule) {
    notFound();
  }

  return <WorkspaceModulePage module={workspaceModule} />;
}