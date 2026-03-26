export type Role = "owner" | "admin" | "member" | "viewer";

export interface UserWithRole {
  id: string;
  email: string;
  role: Role;
  orgId: string | null;
}

/** 역할 계층 — 숫자가 높을수록 상위 권한 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

/** 역할 한글 라벨 */
export const ROLE_LABELS: Record<Role, string> = {
  owner: "소유자",
  admin: "관리자",
  member: "멤버",
  viewer: "뷰어",
};
