/**
 * ============================================================================
 * TITAN Platform Diagnostics
 * ============================================================================
 */

export type DiagnosticStatus =
  | "Healthy"
  | "Warning"
  | "Critical";

  export interface ModuleDiagnostic {

  module: string;

  status: DiagnosticStatus;

  executionTime: number;

  details: string;

}

export interface PlatformDiagnostics {

  modules: ModuleDiagnostic[];

  averageExecutionTime: number;

  healthyModules: number;

  warningModules: number;

  criticalModules: number;

}

export interface PlatformHealth {

  diagnostics: PlatformDiagnostics;

  generatedAt: Date;

}