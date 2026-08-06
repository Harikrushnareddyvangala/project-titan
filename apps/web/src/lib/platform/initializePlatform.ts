import { ModuleRegistry } from "./registry";

import { dashboardModules } from "./metadata/dashboard";

let initialized = false;

/**
 * Initializes the TITAN Platform Registry.
 *
 * This function is intentionally idempotent.
 * Calling it multiple times will not register
 * duplicate modules.
 */
export function initializePlatform(): void {
  if (initialized) {
    return;
  }

  dashboardModules.forEach((module) => {
    ModuleRegistry.register(module);
  });

  initialized = true;
}