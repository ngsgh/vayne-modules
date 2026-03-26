import type { Comment } from "@/types/board";
import { SEED_COMMENTS } from "./board-seed";

let comments: Comment[] = [...SEED_COMMENTS];
let commentSeq = SEED_COMMENTS.length;

function nextCommentId(): string {
  commentSeq += 1;
  return `comment-${commentSeq}`;
}

export function getComments(postId: string): Comment[] {
  return comments.filter((c) => c.postId === postId);
}

type CreateCommentData = {
  postId: string;
  content: string;
  parentId?: string | null;
};

export function createComment(data: CreateCommentData): Comment {
  const now = new Date().toISOString();
  const comment: Comment = {
    id: nextCommentId(),
    postId: data.postId,
    parentId: data.parentId ?? null,
    content: data.content,
    authorId: "user-current",
    authorName: "현재 사용자",
    createdAt: now,
    updatedAt: now,
  };

  comments.push(comment);
  return comment;
}

export function updateComment(
  id: string,
  content: string,
): Comment | null {
  const comment = comments.find((c) => c.id === id);
  if (!comment) return null;

  comment.content = content;
  comment.updatedAt = new Date().toISOString();
  return comment;
}

export function deleteComment(id: string): boolean {
  const idx = comments.findIndex((c) => c.id === id);
  if (idx === -1) return false;

  comments.splice(idx, 1);
  return true;
}

/** 게시글 삭제 시 연관 댓글 일괄 제거 */
export function removeCommentsByPostId(postId: string): void {
  comments = comments.filter((c) => c.postId !== postId);
}
