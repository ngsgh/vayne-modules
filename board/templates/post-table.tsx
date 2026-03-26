"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Post, BoardCategory } from "@/types/board";
import { CATEGORY_LABELS } from "@/types/board";

const CATEGORY_VARIANT: Record<BoardCategory, "default" | "secondary" | "outline"> = {
  notice: "default",
  free: "secondary",
  question: "outline",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

interface PostTableProps {
  posts: Post[];
}

export function PostTable({ posts }: PostTableProps) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        게시글이 없습니다
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">카테고리</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-24">작성자</TableHead>
          <TableHead className="w-16 text-right">조회</TableHead>
          <TableHead className="w-24 text-right">날짜</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              <Badge variant={CATEGORY_VARIANT[post.category]}>
                {CATEGORY_LABELS[post.category]}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                href={`/board/${post.id}`}
                className="hover:underline font-medium"
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {post.authorName}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {post.views}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {formatDate(post.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
