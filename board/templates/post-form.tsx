"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentInput } from "@/app/(app)/board/attachment-input";
import { TagInput } from "@/app/(app)/board/tag-input";

import type { Post, BoardCategory } from "@/types/board";
import { CATEGORY_LABELS } from "@/types/board";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: Post;
}

const CATEGORIES: BoardCategory[] = ["notice", "free", "question"];

export function PostForm({ mode, initialData }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState<BoardCategory>(
    initialData?.category ?? "free",
  );
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [attachments, setAttachments] = useState<string[]>(
    initialData?.attachments ?? [],
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const body = { title, category, content, tags, attachments };
    const url =
      mode === "create" ? "/api/board" : `/api/board/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("저장 실패");
      router.push("/board");
      router.refresh();
    } catch (err) {
      console.error("게시글 저장 오류:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>카테고리</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as BoardCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-48"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>태그</Label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>첨부파일 URL</Label>
        <AttachmentInput attachments={attachments} onChange={setAttachments} />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
