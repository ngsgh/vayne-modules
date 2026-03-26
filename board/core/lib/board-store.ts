import type {
  Post,
  PostFilter,
  PostListResult,
  BoardCategory,
} from "@/types/board";
import { SEED_POSTS } from "./board-seed";
import { removeCommentsByPostId } from "./board-comment-store";

const posts: Post[] = [...SEED_POSTS];
let postSeq = SEED_POSTS.length;

function nextPostId(): string {
  postSeq += 1;
  return `post-${postSeq}`;
}

function matchesFilter(post: Post, filter: PostFilter): boolean {
  if (filter.category && post.category !== filter.category) return false;
  if (!filter.search) return true;

  const q = filter.search.toLowerCase();
  return (
    post.title.toLowerCase().includes(q) ||
    post.content.toLowerCase().includes(q)
  );
}

export function getPosts(filter: PostFilter = {}): PostListResult {
  const filtered = posts.filter((p) => matchesFilter(p, filter));
  const page = filter.page ?? 1;
  const pageSize = filter.pageSize ?? 10;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const sliced = filtered.slice(start, start + pageSize);

  return { posts: sliced, total, page, pageSize, totalPages };
}

export function getPost(id: string): Post | null {
  const post = posts.find((p) => p.id === id);
  if (!post) return null;

  post.views += 1;
  return post;
}

type CreatePostData = {
  title: string;
  content: string;
  category: BoardCategory;
  tags?: string[];
  attachments?: string[];
};

export function createPost(data: CreatePostData): Post {
  const now = new Date().toISOString();
  const post: Post = {
    id: nextPostId(),
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags ?? [],
    authorId: "user-current",
    authorName: "현재 사용자",
    attachments: data.attachments ?? [],
    views: 0,
    createdAt: now,
    updatedAt: now,
  };

  posts.unshift(post);
  return post;
}

type UpdatePostData = {
  title?: string;
  content?: string;
  category?: BoardCategory;
  tags?: string[];
  attachments?: string[];
};

export function updatePost(id: string, data: UpdatePostData): Post | null {
  const post = posts.find((p) => p.id === id);
  if (!post) return null;

  if (data.title !== undefined) post.title = data.title;
  if (data.content !== undefined) post.content = data.content;
  if (data.category !== undefined) post.category = data.category;
  if (data.tags !== undefined) post.tags = data.tags;
  if (data.attachments !== undefined) post.attachments = data.attachments;
  post.updatedAt = new Date().toISOString();

  return post;
}

export function deletePost(id: string): boolean {
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  posts.splice(idx, 1);
  removeCommentsByPostId(id);
  return true;
}
