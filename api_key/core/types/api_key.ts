// api_key 모듈 타입 정의

export type ApiKeyScope = "read" | "write" | "admin";

export interface ApiKey {
  id: string;
  orgId: string;
  name: string;
  /** 마스킹된 키 (예: vk_abc1****) */
  key: string;
  /** 키 앞 8자리 (조회용) */
  prefix: string;
  scopes: ApiKeyScope[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

export const SCOPE_LABELS: Record<ApiKeyScope, string> = {
  read: "읽기",
  write: "쓰기",
  admin: "관리자",
};
