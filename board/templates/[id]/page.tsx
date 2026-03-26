"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ModuleGate } from "@/components/module-gate";
import { PermissionGate } from "@/components/permission-gate";
import { CommentSection } from "@/app/(app)/board/comment-section";
import { usePostDetail } from "@/app/(app)/board/use-post-detail";

import { CATEGORY_LABELS } from "@/types/board";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function BoardDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { post } = usePostDetail(params.id);

  async function handleDelete() {
    try {
      const res = await fetch(`/api/board/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      router.push("/board");
      router.refresh();
    } catch (err) {
      console.error("게시글 삭제 오류:", err);
    }
  }

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
      <PageHeader title={post.title} />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge>{CATEGORY_LABELS[post.category]}</Badge>
          <span>{post.authorName}</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>조회 {post.views}</span>
        </div>

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="prose max-w-none whitespace-pre-wrap text-sm">
          {post.content}
        </div>

        {post.attachments.length > 0 ? (
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium">첨부파일</h4>
            <ul className="text-sm text-muted-foreground">
              {post.attachments.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <PermissionGate action="update" fallback="hide">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={`/board/${post.id}/edit`} />}
            >
              수정
            </Button>
          </PermissionGate>
          <PermissionGate action="delete" fallback="hide">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              삭제
            </Button>
          </PermissionGate>
        </div>

        <hr className="border-border" />

        <CommentSection postId={post.id} />
      </div>
    </ModuleGate>
  );
}
