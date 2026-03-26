"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ModuleGate } from "@/components/module-gate";
import { PostForm } from "@/app/(app)/board/post-form";

export default function BoardWritePage() {
  return (
    <ModuleGate module="board">
      <PageHeader title="글쓰기" description="새 게시글 작성" />
      <PostForm mode="create" />
    </ModuleGate>
  );
}
