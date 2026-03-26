"use client";

import { useEffect, useReducer, useState } from "react";

import type { BoardCategory, PostListResult } from "@/types/board";

const EMPTY_RESULT: PostListResult = {
  posts: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
};

interface UsePostsOptions {
  category: BoardCategory | "all";
  search: string;
  page: number;
}

export function usePosts({ category, search, page }: UsePostsOptions) {
  const [result, setResult] = useState<PostListResult>(EMPTY_RESULT);
  const [tick, forceRefresh] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      params.set("page", String(page));

      try {
        const res = await fetch(`/api/board?${params.toString()}`);
        if (cancelled || !res.ok) return;
        const data: PostListResult = await res.json();
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) console.error("게시글 로딩 오류:", err);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [category, search, page, tick]);

  return { result, refresh: forceRefresh };
}
