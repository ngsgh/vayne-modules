"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { Badge } from "@/components/ui/badge";
import { ModuleGate } from "@/components/module-gate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS } from "@/types/auth";

import type { Role } from "@/types/auth";

const ROLES: Role[] = ["owner", "admin", "member", "viewer"];

/**
 * 역할 전환 테스트 UI.
 * 현재 역할을 바꿔서 PermissionGate 동작을 실시간 확인 가능.
 */
export function RoleSwitcher() {
  const { role, setRole } = useCurrentRole();

  return (
    <ModuleGate module="rbac">
    <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-warning-400 bg-warning-25">
      <Badge variant="outline" className="shrink-0">테스트</Badge>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        현재 역할:
      </span>
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger size="sm" className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              {ROLE_LABELS[r]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs text-gray-400">
        역할을 바꿔서 버튼 권한 변화를 확인하세요
      </span>
    </div>
    </ModuleGate>
  );
}
