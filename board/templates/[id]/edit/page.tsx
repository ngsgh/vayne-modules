"use client";

import { useParams } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ModuleGate } from "@/components/module-gate";
import { PostForm } from "@/app/(app)/board/post-form";
import { usePostDetail } from "@/app/(app)/board/use-post-detail";

export default function BoardEditPage() {
  const params = useParams<{ id: string }>();
  const { post } = usePostDetail(params.id);

  if (!post) {
    return (
      <ModuleGate module="board">
        <p className="py-12 text-center text-sm text-muted-foreground">
          로딩 중...
        </p>
      </ModuleGate>
    );
  }

  return (
    <ModuleGate module="board">
      <PageHeader title="게시글 수정" description={post.title} />
      <PostForm mode="edit" initialData={post} />
    </ModuleGate>
  );
}
