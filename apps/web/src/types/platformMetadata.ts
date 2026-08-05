/**
 * ============================================================================
 * TITAN Platform Metadata
 * ============================================================================
 */

export type ModuleCategory =
  | "Analytics"
  | "Portfolio"
  | "Engineering"
  | "Executive"
  | "Platform";

export type ModuleMaturity =
  | "Experimental"
  | "Beta"
  | "Stable";

export interface PlatformModuleMetadata {

  id: string;

  name: string;

  category: ModuleCategory;

  maturity: ModuleMaturity;

  version: string;

  description: string;

}