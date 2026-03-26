import { NextRequest, NextResponse } from "next/server";

import { getPosts, createPost } from "@/lib/board";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import type { BoardCategory } from "@/types/board";

export async function GET(request: NextRequest) {
  try {
    requireModule("board");

    const params = request.nextUrl.searchParams;
    const category = params.get("category") as BoardCategory | null;
    const search = params.get("search") ?? undefined;
    const page = params.get("page") ? Number(params.get("page")) : undefined;
    const pageSize = params.get("pageSize")
      ? Number(params.get("pageSize"))
      : undefined;

    const sort = params.get("sort") ?? "latest";

    const result = getPosts({
      category: category ?? undefined,
      search,
      page,
      pageSize,
      sort: sort as "latest" | "popular" | "comments",
    });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("게시글 목록 조회 실패");
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

type CreatePostBody = {
  title: string;
  content: string;
  category: BoardCategory;
  tags?: string[];
  attachments?: string[];
};

export async function POST(request: Request) {
  try {
    requireModule("board");

    const body = (await request.json()) as CreatePostBody;

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: "필수 항목을 입력해 주세요." },
        { status: 400 },
      );
    }

    const post = createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("게시글 작성 실패");
    return NextResponse.json(
      { error: "게시글 작성에 실패했습니다." },
      { status: 500 },
    );
  }
}
