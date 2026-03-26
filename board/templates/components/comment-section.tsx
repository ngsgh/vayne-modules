"use client";

import { useEffect, useReducer, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGate } from "@/components/permission-gate";
import { CommentItem } from "@/app/(app)/board/comment-item";

import type { Comment } from "@/types/board";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tick, forceRefresh] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/board/${postId}/comments`);
        if (cancelled || !res.ok) return;
        const data = (await res.json()) as { comments: Comment[] };
        if (!cancelled) setComments(data.comments);
      } catch (err) {
        if (!cancelled) console.error("댓글 로딩 오류:", err);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [postId, tick]);

  async function handleCreate() {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/board/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, parentId: null }),
      });
      if (!res.ok) throw new Error("댓글 등록 실패");
      setNewComment("");
      forceRefresh();
    } catch (err) {
      console.error("댓글 등록 오류:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(parentId: string, content: string) {
    const res = await fetch(`/api/board/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    });
    if (!res.ok) throw new Error("답글 등록 실패");
    forceRefresh();
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/board/comments/${commentId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("댓글 삭제 실패");
    forceRefresh();
  }

  const topLevel = comments.filter((c) => c.parentId === null);

  function getReplies(parentId: string): Comment[] {
    return comments.filter((c) => c.parentId === parentId);
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">
        댓글 {comments.length > 0 ? `(${comments.length})` : ""}
      </h3>

      <PermissionGate action="create" fallback="hide">
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={submitting}
              onClick={handleCreate}
            >
              {submitting ? "등록 중..." : "댓글 등록"}
            </Button>
          </div>
        </div>
      </PermissionGate>

      <div className="flex flex-col gap-3">
        {topLevel.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            댓글이 없습니다
          </p>
        ) : (
          topLevel.map((c) => (
            <div key={c.id} className="flex flex-col gap-2">
              <CommentItem
                comment={c}
                onReply={handleReply}
                onDelete={handleDelete}
              />
              {getReplies(c.id).map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
