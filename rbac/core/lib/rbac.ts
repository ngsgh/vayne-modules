import { ROLE_HIERARCHY } from "@/types/auth";

import type { Role } from "@/types/auth";

/** 사용자 역할이 요구 역할 이상인지 확인 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * 권한 매트릭스
 * - owner: 모든 리소스에 대한 모든 액션
 * - admin: delete_org, transfer_ownership 제외 전체
 * - member: 자신의 리소스에 대해 read, create, update
 * - viewer: read만 가능
 */
export const PERMISSIONS: Record<Role, Record<string, string[]>> = {
  owner: {
    "*": ["*"],
  },
  admin: {
    "*": [
      "read",
      "create",
      "update",
      "delete",
      "invite",
      "manage_members",
      "manage_settings",
    ],
  },
  member: {
    "*": ["read", "create", "update"],
  },
  viewer: {
    "*": ["read"],
  },
};

/** admin에게 금지된 액션 */
const ADMIN_BLOCKED_ACTIONS = ["delete_org", "transfer_ownership"];

/** 사용자 역할이 특정 리소스/액션에 접근 가능한지 확인 */
export function canAccess(
  userRole: Role,
  _resource: string,
  action: string,
): boolean {
  // owner는 모든 것 허용
  if (userRole === "owner") return true;

  // admin은 특정 액션만 차단
  if (userRole === "admin") {
    return !ADMIN_BLOCKED_ACTIONS.includes(action);
  }

  const rolePerms = PERMISSIONS[userRole];
  const wildcardActions = rolePerms["*"];

  if (!wildcardActions) return false;

  return wildcardActions.includes(action);
}
