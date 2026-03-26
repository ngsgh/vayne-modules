"use client";

import { useEffect, useReducer, useState } from "react";

import type { Post } from "@/types/board";

export function usePostDetail(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [tick, forceRefresh] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/board/${postId}`);
        if (cancelled || !res.ok) return;
        const data: Post = await res.json();
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled) console.error("게시글 로딩 오류:", err);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [postId, tick]);

  return { post, refresh: forceRefresh };
}
