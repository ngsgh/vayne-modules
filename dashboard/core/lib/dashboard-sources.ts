import type { DataSourceEntry, DataSourceMeta } from "@/types/dashboard";

const registry = new Map<string, DataSourceEntry>();

export function registerDataSource(entry: DataSourceEntry): void {
  registry.set(entry.id, entry);
}

export function getDataSources(): DataSourceMeta[] {
  return Array.from(registry.values()).map(
    ({ id, module, label, type }) => ({ id, module, label, type }),
  );
}

export function fetchDataSource(
  id: string,
  orgId: string,
): unknown {
  const entry = registry.get(id);
  if (!entry) return null;
  return entry.fetch(orgId);
}
