import { NextRequest, NextResponse } from "next/server";

import { requireOrg, requireRole } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import {
  createApiKey,
  getApiKeys,
  deleteApiKey,
} from "@/lib/api_key";

import type { ApiKeyScope } from "@/types/api_key";

/** GET: 조직의 API 키 목록 조회 */
export async function GET() {
  try {
    requireModule("api_key");
    const user = await requireOrg();
    const keys = getApiKeys(user.orgId);
    return NextResponse.json({ keys });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("API 키 목록 조회 실패");
    return NextResponse.json(
      { error: "API 키를 불러올 수 없습니다." },
      { status: 500 },
    );
  }
}

type CreateBody = {
  name: string;
  scopes: ApiKeyScope[];
  expiresAt?: string;
};

/** POST: 새 API 키 생성 (admin 이상) */
export async function POST(request: NextRequest) {
  try {
    requireModule("api_key");
    await requireRole("admin");
    const user = await requireOrg();

    const body = (await request.json()) as CreateBody;

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "이름은 필수입니다." },
        { status: 400 },
      );
    }

    if (!body.scopes?.length) {
      return NextResponse.json(
        { error: "최소 하나의 권한을 선택하세요." },
        { status: 400 },
      );
    }

    const result = createApiKey(
      user.orgId,
      body.name.trim(),
      body.scopes,
      body.expiresAt,
    );

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("API 키 생성 실패");
    return NextResponse.json(
      { error: "API 키 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}

/** DELETE: API 키 삭제 */
export async function DELETE(request: NextRequest) {
  try {
    requireModule("api_key");
    const user = await requireOrg();

    const { id } = (await request.json()) as { id: string };

    if (!id) {
      return NextResponse.json(
        { error: "키 ID는 필수입니다." },
        { status: 400 },
      );
    }

    const deleted = deleteApiKey(user.orgId, id);

    if (!deleted) {
      return NextResponse.json(
        { error: "키를 찾을 수 없습니다." },
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
    console.error("API 키 삭제 실패");
    return NextResponse.json(
      { error: "API 키 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
