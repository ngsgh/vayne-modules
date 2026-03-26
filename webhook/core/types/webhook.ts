// webhook 모듈 타입 정의

export interface WebhookEndpoint {
  id: string;
  orgId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WebhookEvent =
  | "post.created"
  | "post.deleted"
  | "member.invited"
  | "member.removed"
  | "org.updated"
  | "credits.used";

export interface WebhookDelivery {
  id: string;
  endpointId: string;
  event: string;
  payload: unknown;
  status: number;
  response: string | null;
  createdAt: string;
}

export const EVENT_LABELS: Record<WebhookEvent, string> = {
  "post.created": "게시글 생성",
  "post.deleted": "게시글 삭제",
  "member.invited": "멤버 초대",
  "member.removed": "멤버 제거",
  "org.updated": "조직 업데이트",
  "credits.used": "크레딧 사용",
};
