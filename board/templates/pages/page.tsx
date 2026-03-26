"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { ModuleGate } from "@/components/module-gate";
import { PermissionGate } from "@/components/permission-gate";
import { PostTable } from "@/app/(app)/board/post-table";
import { usePosts } from "@/app/(app)/board/use-posts";

import type { BoardCategory } from "@/types/board";
import { CATEGORY_LABELS } from "@/types/board";

const CATEGORIES: (BoardCategory | "all")[] = ["all", "notice", "free", "question"];

const CATEGORY_FILTER_LABELS: Record<string, string> = {
  all: "전체",
  ...CATEGORY_LABELS,
};

export default function BoardPage() {
  const [category, setCategory] = useState<BoardCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { result } = usePosts({ category, search, page });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <ModuleGate module="board">
      <PageHeader title="게시판" description="커뮤니티 게시판" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1">
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                variant={category === c ? "default" : "outline"}
                size="sm"
                onClick={() => { setCategory(c); setPage(1); }}
              >
                {CATEGORY_FILTER_LABELS[c]}
              </Button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="검색어 입력"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Button type="submit" variant="outline" size="sm">
              검색
            </Button>
          </form>
        </div>

        <PostTable posts={result.posts} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </Button>
            <span className="text-sm text-muted-foreground">
              {result.page} / {result.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= result.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </div>
          <PermissionGate action="create" fallback="hide">
            <Button nativeButton={false} render={<Link href="/board/write" />}>글쓰기</Button>
          </PermissionGate>
        </div>
      </div>
    </ModuleGate>
  );
}
