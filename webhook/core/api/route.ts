import { NextResponse } from "next/server";

import { requireOrg, requireRole } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import { getEndpoints, createEndpoint } from "@/lib/webhook";

export async function GET() {
  try {
    requireModule("webhook");
    const user = await requireOrg();
    const list = getEndpoints(user.orgId);
    return NextResponse.json({ data: list });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("웹훅 목록 조회 실패");
    return NextResponse.json(
      { error: "웹훅 목록을 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    requireModule("webhook");
    await requireRole("admin");
    const user = await requireOrg();

    const body = await request.json();
    if (!body.url || !body.events?.length) {
      return NextResponse.json(
        { error: "URL과 이벤트를 입력해 주세요." },
        { status: 400 },
      );
    }

    const endpoint = createEndpoint(user.orgId, body.url, body.events);
    return NextResponse.json(endpoint, { status: 201 });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    if (err instanceof Error && err.message === "권한이 없습니다") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    console.error("웹훅 생성 실패");
    return NextResponse.json(
      { error: "웹훅 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
