import { NextResponse } from "next/server";

import { getComments, createComment } from "@/lib/board";
import { requireModule, ModuleDisabledError } from "@/lib/modules";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    requireModule("board");

    const { id } = await params;
    const list = getComments(id);

    return NextResponse.json({ comments: list });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("댓글 조회 실패");
    return NextResponse.json(
      { error: "댓글을 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

type CreateCommentBody = {
  content: string;
  parentId?: string | null;
};

export async function POST(request: Request, { params }: RouteParams) {
  try {
    requireModule("board");

    const { id } = await params;
    const body = (await request.json()) as CreateCommentBody;

    if (!body.content) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해 주세요." },
        { status: 400 },
      );
    }

    const comment = createComment({
      postId: id,
      content: body.content,
      parentId: body.parentId,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("댓글 작성 실패");
    return NextResponse.json(
      { error: "댓글 작성에 실패했습니다." },
      { status: 500 },
    );
  }
}
