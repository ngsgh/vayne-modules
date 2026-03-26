// api_key 모듈 비즈니스 로직
// 코어 영역 — vayne-cli update 시 덮어쓰기 대상

import type { ApiKey, ApiKeyScope } from "@/types/api_key";

interface StoredKey {
  id: string;
  orgId: string;
  name: string;
  prefix: string;
  hashedKey: string;
  scopes: ApiKeyScope[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

const store: StoredKey[] = [];

/** 간단한 해시 (데모용, 프로덕션에서는 bcrypt/argon2 사용) */
function hashKey(raw: string): string {
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}`;
}

/** 랜덤 키 생성 */
function generateRawKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "vk_";
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** 마스킹된 키 반환 */
function maskKey(prefix: string): string {
  return `${prefix}${"*".repeat(8)}`;
}

/** StoredKey → ApiKey (외부 노출용) */
function toApiKey(stored: StoredKey): ApiKey {
  return {
    id: stored.id,
    orgId: stored.orgId,
    name: stored.name,
    key: maskKey(stored.prefix),
    prefix: stored.prefix,
    scopes: stored.scopes,
    expiresAt: stored.expiresAt,
    lastUsedAt: stored.lastUsedAt,
    createdAt: stored.createdAt,
  };
}

/** API 키 생성 — 전체 키는 이때만 반환 */
export function createApiKey(
  orgId: string,
  name: string,
  scopes: ApiKeyScope[],
  expiresAt?: string,
): { apiKey: ApiKey; rawKey: string } {
  const rawKey = generateRawKey();
  const prefix = rawKey.slice(0, 8);

  const stored: StoredKey = {
    id: crypto.randomUUID(),
    orgId,
    name,
    prefix,
    hashedKey: hashKey(rawKey),
    scopes,
    expiresAt: expiresAt ?? null,
    lastUsedAt: null,
    createdAt: new Date().toISOString(),
  };

  store.push(stored);
  return { apiKey: toApiKey(stored), rawKey };
}

/** 조직의 API 키 목록 조회 */
export function getApiKeys(orgId: string): ApiKey[] {
  return store
    .filter((k) => k.orgId === orgId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map(toApiKey);
}

/** API 키 삭제 */
export function deleteApiKey(orgId: string, keyId: string): boolean {
  const idx = store.findIndex(
    (k) => k.id === keyId && k.orgId === orgId,
  );
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

/** API 키 검증 — prefix로 찾고, 해시 비교 */
export function validateApiKey(
  rawKey: string,
): { orgId: string; scopes: ApiKeyScope[] } | null {
  const prefix = rawKey.slice(0, 8);
  const hashed = hashKey(rawKey);

  const found = store.find(
    (k) => k.prefix === prefix && k.hashedKey === hashed,
  );
  if (!found) return null;

  if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
    return null;
  }

  found.lastUsedAt = new Date().toISOString();
  return { orgId: found.orgId, scopes: found.scopes };
}

/** API 키 이름 변경 */
export function updateApiKeyName(
  orgId: string,
  keyId: string,
  name: string,
): ApiKey | null {
  const found = store.find(
    (k) => k.id === keyId && k.orgId === orgId,
  );
  if (!found) return null;
  found.name = name;
  return toApiKey(found);
}
