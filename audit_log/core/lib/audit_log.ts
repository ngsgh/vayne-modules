import type { AuditLogEntry, AuditAction, ActorType } from "@/types/audit_log";

const store: AuditLogEntry[] = [];

interface LogEventParams {
  orgId: string;
  actorId: string;
  actorType?: ActorType;
  actorName?: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

/** 감사 로그 기록 (append-only) */
export function logAuditEvent(params: LogEventParams): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    orgId: params.orgId,
    actorId: params.actorId,
    actorType: params.actorType ?? "user",
    actorName: params.actorName ?? params.actorId,
    action: params.action,
    targetType: params.targetType ?? null,
    targetId: params.targetId ?? null,
    targetName: params.targetName ?? null,
    metadata: params.metadata ?? null,
    ipAddress: params.ipAddress ?? null,
    createdAt: new Date().toISOString(),
  };

  store.push(entry);
  return entry;
}

/** 감사 로그 조회 (org별 필터, 최신순) */
export function getAuditLogs(
  orgId: string,
  options?: { limit?: number; offset?: number; action?: string },
): { entries: AuditLogEntry[]; total: number } {
  let filtered = store.filter((e) => e.orgId === orgId);

  if (options?.action) {
    filtered = filtered.filter((e) => e.action === options.action);
  }

  filtered.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const total = filtered.length;
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  return {
    entries: filtered.slice(offset, offset + limit),
    total,
  };
}
