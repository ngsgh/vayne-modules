import { NextResponse } from "next/server";

import { requireOrg } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import {
  getDocuments,
  getDocument,
  createDocument,
  decideStep,
} from "@/lib/approval";
import type { ApprovalCategory } from "@/types/approval";

export async function GET(request: Request) {
  try {
    requireModule("approval");
    const user = await requireOrg();

    const url = new URL(request.url);
    const docId = url.searchParams.get("id");

    if (docId) {
      const doc = getDocument(user.orgId, docId);
      if (!doc) {
        return NextResponse.json(
          { error: "문서를 찾을 수 없습니다" },
          { status: 404 },
        );
      }
      return NextResponse.json(doc);
    }

    const docs = getDocuments(user.orgId);
    return NextResponse.json({ documents: docs });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("결재 문서 조회 실패");
    return NextResponse.json(
      { error: "결재 문서를 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}

type CreateBody = {
  action: "create";
  title: string;
  content: string;
  category: ApprovalCategory;
  steps: Array<{ approverId: string; approverName: string }>;
};

type DecideBody = {
  action: "decide";
  docId: string;
  stepId: string;
  decision: "approved" | "rejected";
  comment?: string;
};

export async function POST(request: Request) {
  try {
    requireModule("approval");
    const user = await requireOrg();
    const body = (await request.json()) as CreateBody | DecideBody;

    if (body.action === "create") {
      const doc = createDocument(user.orgId, {
        title: body.title,
        content: body.content,
        category: body.category,
        authorId: user.id,
        authorName: user.email,
        steps: body.steps,
      });
      return NextResponse.json(doc, { status: 201 });
    }

    if (body.action === "decide") {
      const doc = decideStep(
        user.orgId,
        body.docId,
        body.stepId,
        body.decision,
        body.comment ?? "",
      );
      if (!doc) {
        return NextResponse.json(
          { error: "결재 처리에 실패했습니다" },
          { status: 400 },
        );
      }
      return NextResponse.json(doc);
    }

    return NextResponse.json(
      { error: "잘못된 요청입니다" },
      { status: 400 },
    );
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("결재 처리 실패");
    return NextResponse.json(
      { error: "결재 처리에 실패했습니다" },
      { status: 500 },
    );
  }
}
