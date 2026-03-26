import { NextResponse } from "next/server";

import { updateComment, deleteComment } from "@/lib/board";
import { requireModule, ModuleDisabledError } from "@/lib/modules";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    requireModule("board");

    const { id } = await params;
    const body = (await request.json()) as { content: string };

    if (!body.content) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해 주세요." },
        { status: 400 },
      );
    }

    const updated = updateComment(id, body.content);

    if (!updated) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
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
    console.error("댓글 수정 실패");
    return NextResponse.json(
      { error: "댓글 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    requireModule("board");

    const { id } = await params;
    const deleted = deleteComment(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
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
    console.error("댓글 삭제 실패");
    return NextResponse.json(
      { error: "댓글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
