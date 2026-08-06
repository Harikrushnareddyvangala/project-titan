import type {
  ModuleCategory,
  PlatformModule,
} from "./moduleTypes";

const registry = new Map<string, PlatformModule>();

export const ModuleRegistry = {
  register(module: PlatformModule): void {
    registry.set(module.id, module);
  },

  unregister(id: string): boolean {
    return registry.delete(id);
  },

  get(id: string): PlatformModule | undefined {
    return registry.get(id);
  },

  has(id: string): boolean {
    return registry.has(id);
  },

  getAll(): PlatformModule[] {
    return [...registry.values()];
  },

  getByCategory(
    category: ModuleCategory
  ): PlatformModule[] {
    return this.getAll().filter(
      (module) => module.category === category
    );
  },

  getEnabled(): PlatformModule[] {
    return this.getAll().filter(
      (module) => module.enabled
    );
  },

  getExperimental(): PlatformModule[] {
    return this.getAll().filter(
      (module) => module.experimental
    );
  },

  getByPriority(): PlatformModule[] {
    return [...this.getAll()].sort(
      (a, b) => a.priority - b.priority
    );
  },

  clear(): void {
    registry.clear();
  },

  size(): number {
    return registry.size;
  },
};