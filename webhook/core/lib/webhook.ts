// webhook 모듈 비즈니스 로직
// 코어 영역 — vayne-cli update 시 덮어쓰기 대상

import type {
  WebhookEndpoint,
  WebhookDelivery,
  WebhookEvent,
} from "@/types/webhook";

const endpoints = new Map<string, WebhookEndpoint>();
const deliveries: WebhookDelivery[] = [];

function generateId(): string {
  return `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateSecret(): string {
  return `whsec_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

function maskSecret(secret: string): string {
  return `${secret.slice(0, 10)}${"*".repeat(secret.length - 10)}`;
}

/** 엔드포인트 생성 */
export function createEndpoint(
  orgId: string,
  url: string,
  events: string[],
): WebhookEndpoint {
  const now = new Date().toISOString();
  const endpoint: WebhookEndpoint = {
    id: generateId(),
    orgId,
    url,
    events,
    secret: generateSecret(),
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  endpoints.set(endpoint.id, endpoint);
  return endpoint;
}

/** 조직의 엔드포인트 목록 (secret 마스킹) */
export function getEndpoints(orgId: string): WebhookEndpoint[] {
  return Array.from(endpoints.values())
    .filter((ep) => ep.orgId === orgId)
    .map((ep) => ({ ...ep, secret: maskSecret(ep.secret) }));
}

/** 엔드포인트 단건 조회 (secret 마스킹) */
export function getEndpoint(
  orgId: string,
  endpointId: string,
): WebhookEndpoint | null {
  const ep = endpoints.get(endpointId);
  if (!ep || ep.orgId !== orgId) return null;
  return { ...ep, secret: maskSecret(ep.secret) };
}

/** 엔드포인트 업데이트 */
export function updateEndpoint(
  orgId: string,
  endpointId: string,
  data: Partial<Pick<WebhookEndpoint, "url" | "events" | "active">>,
): WebhookEndpoint | null {
  const ep = endpoints.get(endpointId);
  if (!ep || ep.orgId !== orgId) return null;

  if (data.url !== undefined) ep.url = data.url;
  if (data.events !== undefined) ep.events = data.events;
  if (data.active !== undefined) ep.active = data.active;
  ep.updatedAt = new Date().toISOString();

  return { ...ep, secret: maskSecret(ep.secret) };
}

/** 엔드포인트 삭제 */
export function deleteEndpoint(
  orgId: string,
  endpointId: string,
): boolean {
  const ep = endpoints.get(endpointId);
  if (!ep || ep.orgId !== orgId) return false;
  return endpoints.delete(endpointId);
}

/** 배달 로그 조회 */
export function getDeliveries(
  endpointId: string,
  limit = 20,
): WebhookDelivery[] {
  return deliveries
    .filter((d) => d.endpointId === endpointId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

/** 웹훅 디스패치 (인메모리: 배달 로그만 기록) */
export function dispatchWebhook(
  orgId: string,
  event: WebhookEvent,
  payload: unknown,
): void {
  const matching = Array.from(endpoints.values()).filter(
    (ep) => ep.orgId === orgId && ep.active && ep.events.includes(event),
  );

  for (const ep of matching) {
    const delivery: WebhookDelivery = {
      id: `del_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      endpointId: ep.id,
      event,
      payload,
      status: 200,
      response: '{"ok":true}',
      createdAt: new Date().toISOString(),
    };
    deliveries.push(delivery);
  }
}
