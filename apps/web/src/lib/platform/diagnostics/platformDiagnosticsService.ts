import type {
  PlatformDiagnostics,
} from "@/types/platform";

import { DiagnosticRegistry } from "./diagnosticRegistry";

export function buildPlatformDiagnostics(

  registry: DiagnosticRegistry,

): PlatformDiagnostics {

  const diagnostics =
    registry.getDiagnostics();

  const averageExecutionTime =
    diagnostics.length === 0
      ? 0
      : diagnostics.reduce(

          (total, module) =>
            total + module.executionTime,

          0,

        ) / diagnostics.length;

  return {

    modules:
      diagnostics,

    averageExecutionTime,

    healthyModules:
      diagnostics.filter(

        (module) =>
          module.status === "Healthy",

      ).length,

    warningModules:
      diagnostics.filter(

        (module) =>
          module.status === "Warning",

      ).length,

    criticalModules:
      diagnostics.filter(

        (module) =>
          module.status === "Critical",

      ).length,

  };

}