import { NextRequest, NextResponse } from "next/server";

import { requireOrg } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import { getAuditLogs, logAuditEvent } from "@/lib/audit_log";

import type { AuditAction } from "@/types/audit_log";

/** GET: 감사 로그 조회 */
export async function GET(request: NextRequest) {
  try {
    requireModule("audit_log");
    const user = await requireOrg();

    const params = request.nextUrl.searchParams;
    const limit = params.get("limit")
      ? Number(params.get("limit"))
      : undefined;
    const offset = params.get("offset")
      ? Number(params.get("offset"))
      : undefined;
    const action = params.get("action") ?? undefined;

    const result = getAuditLogs(user.orgId, { limit, offset, action });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("감사 로그 조회 실패");
    return NextResponse.json(
      { error: "감사 로그를 불러올 수 없습니다." },
      { status: 500 },
    );
  }
}

type LogBody = {
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
};

/** POST: 감사 로그 기록 */
export async function POST(request: Request) {
  try {
    requireModule("audit_log");
    const user = await requireOrg();

    const body = (await request.json()) as LogBody;

    if (!body.action) {
      return NextResponse.json(
        { error: "action은 필수입니다." },
        { status: 400 },
      );
    }

    const entry = logAuditEvent({
      orgId: user.orgId,
      actorId: user.id,
      actorName: user.email,
      action: body.action,
      targetType: body.targetType,
      targetId: body.targetId,
      targetName: body.targetName,
      metadata: body.metadata,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("감사 로그 기록 실패");
    return NextResponse.json(
      { error: "로그 기록에 실패했습니다." },
      { status: 500 },
    );
  }
}
