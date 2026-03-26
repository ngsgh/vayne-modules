export type AuditAction =
  | "member.invited"
  | "member.removed"
  | "member.role_changed"
  | "org.created"
  | "org.updated"
  | "org.deleted"
  | "post.created"
  | "post.updated"
  | "post.deleted"
  | "comment.created"
  | "comment.deleted"
  | "module.enabled"
  | "module.disabled"
  | "module.settings_changed"
  | "credits.used"
  | "credits.recharged"
  | "settings.updated";

export type ActorType = "user" | "system" | "api";

export interface AuditLogEntry {
  id: string;
  orgId: string;
  actorId: string;
  actorType: ActorType;
  actorName: string;
  action: AuditAction;
  targetType: string | null;
  targetId: string | null;
  targetName: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

export const ACTION_LABELS: Record<AuditAction, string> = {
  "member.invited": "멤버 초대",
  "member.removed": "멤버 제거",
  "member.role_changed": "역할 변경",
  "org.created": "워크스페이스 생성",
  "org.updated": "워크스페이스 수정",
  "org.deleted": "워크스페이스 삭제",
  "post.created": "게시글 작성",
  "post.updated": "게시글 수정",
  "post.deleted": "게시글 삭제",
  "comment.created": "댓글 작성",
  "comment.deleted": "댓글 삭제",
  "module.enabled": "모듈 활성화",
  "module.disabled": "모듈 비활성화",
  "module.settings_changed": "모듈 설정 변경",
  "credits.used": "크레딧 사용",
  "credits.recharged": "크레딧 충전",
  "settings.updated": "설정 변경",
};
