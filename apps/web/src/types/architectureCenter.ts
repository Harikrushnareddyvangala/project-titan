/**
 * ============================================================================
 * TITAN Architecture Center
 * ============================================================================
 */

export type ArchitectureLayer =
  | "Data Source"
  | "Analytics"
  | "Engineering Intelligence"
  | "Executive Intelligence"
  | "Platform"
  | "Presentation";

  export interface ArchitectureModule {

  id: string;

  name: string;

  layer: ArchitectureLayer;

  description: string;

}

export interface ArchitectureConnection {

  source: string;

  target: string;

}

export interface ArchitectureCenter {

  modules: ArchitectureModule[];

  connections: ArchitectureConnection[];

}

export interface PlatformStatistic {

  label: string;

  value: string;

  description: string;

}

export interface ArchitectureCenter {

  modules: ArchitectureModule[];

  connections: ArchitectureConnection[];

  statistics: PlatformStatistic[];

}