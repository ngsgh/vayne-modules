import { NextResponse } from "next/server";

import { getPost, updatePost, deletePost } from "@/lib/board";
import { requireModule, ModuleDisabledError } from "@/lib/modules";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    requireModule("board");

    const { id } = await params;
    const post = getPost(id);

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("게시글 조회 실패");
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    requireModule("board");

    const { id } = await params;
    const body = await request.json();
    const updated = updatePost(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
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
    console.error("게시글 수정 실패");
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    requireModule("board");

    const { id } = await params;
    const deleted = deletePost(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
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
    console.error("게시글 삭제 실패");
    return NextResponse.json(
      { error: "게시글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
