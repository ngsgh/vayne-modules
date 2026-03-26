export type BoardCategory = "notice" | "free" | "question";

export const CATEGORY_LABELS: Record<BoardCategory, string> = {
  notice: "공지",
  free: "자유",
  question: "질문",
};

export type Post = {
  id: string;
  title: string;
  content: string;
  category: BoardCategory;
  tags: string[];
  authorId: string;
  authorName: string;
  attachments: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type PostFilter = {
  category?: BoardCategory;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type PostListResult = {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
