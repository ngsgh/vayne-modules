import { NextResponse } from "next/server";

import { requireOrg } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import {
  getEndpoint,
  updateEndpoint,
  deleteEndpoint,
  getDeliveries,
} from "@/lib/webhook";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    requireModule("webhook");
    const user = await requireOrg();
    const { id } = await params;

    const endpoint = getEndpoint(user.orgId, id);
    if (!endpoint) {
      return NextResponse.json(
        { error: "엔드포인트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const deliveryLog = getDeliveries(id);
    return NextResponse.json({ endpoint, deliveries: deliveryLog });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("웹훅 상세 조회 실패");
    return NextResponse.json(
      { error: "웹훅 상세를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    requireModule("webhook");
    const user = await requireOrg();
    const { id } = await params;

    const body = await request.json();
    const updated = updateEndpoint(user.orgId, id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "엔드포인트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("웹훅 업데이트 실패");
    return NextResponse.json(
      { error: "웹훅 업데이트에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams,
) {
  try {
    requireModule("webhook");
    const user = await requireOrg();
    const { id } = await params;

    const deleted = deleteEndpoint(user.orgId, id);
    if (!deleted) {
      return NextResponse.json(
        { error: "엔드포인트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("웹훅 삭제 실패");
    return NextResponse.json(
      { error: "웹훅 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
