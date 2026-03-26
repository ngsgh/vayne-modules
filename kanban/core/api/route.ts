import { NextResponse } from "next/server";

import { requireOrg } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import { getColumns, getCards, initDefaultColumns } from "@/lib/kanban";
import { handleKanbanAction } from "./kanban-actions";

export async function GET() {
  try {
    requireModule("kanban");
    const user = await requireOrg();
    initDefaultColumns(user.orgId);

    return NextResponse.json({
      columns: getColumns(user.orgId),
      cards: getCards(user.orgId),
    });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("칸반 조회 실패");
    return NextResponse.json(
      { error: "칸반 데이터를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    requireModule("kanban");
    const user = await requireOrg();
    initDefaultColumns(user.orgId);

    const body = await request.json();
    return handleKanbanAction(user.orgId, body);
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("칸반 처리 실패");
    return NextResponse.json(
      { error: "칸반 처리에 실패했습니다." },
      { status: 500 },
    );
  }
}
