import type {
  ModuleDiagnostic,
} from "@/types/platform";

export class DiagnosticRegistry {

  private readonly diagnostics: ModuleDiagnostic[] = [];

  register(
    diagnostic: ModuleDiagnostic,
  ): void {

    this.diagnostics.push(diagnostic);

  }

  getDiagnostics(): ModuleDiagnostic[] {

    return [...this.diagnostics];

  }

  clear(): void {

    this.diagnostics.length = 0;

  }

}