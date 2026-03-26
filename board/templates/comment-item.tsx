"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGate } from "@/components/permission-gate";

import type { Comment } from "@/types/board";

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${h}:${min}`;
}

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onReply: (parentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentItem({
  comment,
  isReply = false,
  onReply,
  onDelete,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReply() {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={isReply ? "ml-8" : ""}>
      <div className="flex flex-col gap-1 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.authorName}</span>
            <span className="text-muted-foreground">
              {formatDateTime(comment.createdAt)}
            </span>
          </div>
          <div className="flex gap-1">
            <PermissionGate action="create" fallback="hide">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                답글
              </Button>
            </PermissionGate>
            <PermissionGate action="delete" fallback="hide">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(comment.id)}
              >
                삭제
              </Button>
            </PermissionGate>
          </div>
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
      </div>

      {showReplyForm ? (
        <div className="mt-2 ml-4 flex flex-col gap-2">
          <Textarea
            placeholder="답글을 입력하세요"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-16"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplyForm(false)}
            >
              취소
            </Button>
            <Button
              size="sm"
              disabled={submitting}
              onClick={handleReply}
            >
              {submitting ? "등록 중..." : "등록"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
