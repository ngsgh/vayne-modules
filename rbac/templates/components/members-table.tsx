"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionGate } from "@/components/permission-gate";

import { InviteDialog } from "./invite-dialog";

const ROLE_OPTIONS = ["소유자", "관리자", "멤버", "뷰어"] as const;

type Member = {
  name: string;
  email: string;
  role: (typeof ROLE_OPTIONS)[number];
  joinedAt: string;
};

const SAMPLE_MEMBERS: Member[] = [
  { name: "김민수", email: "minsu@example.com", role: "소유자", joinedAt: "2024-01-15" },
  { name: "이지은", email: "jieun@example.com", role: "관리자", joinedAt: "2024-03-22" },
  { name: "박서준", email: "seojun@example.com", role: "멤버", joinedAt: "2024-06-10" },
  { name: "최유나", email: "yuna@example.com", role: "뷰어", joinedAt: "2024-09-05" },
];

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  소유자: "default",
  관리자: "secondary",
  멤버: "outline",
  뷰어: "outline",
};

export function MembersTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">멤버 목록</h2>
          <p className="text-sm text-muted-foreground">
            팀 멤버와 역할을 관리합니다.
          </p>
        </div>
        <PermissionGate action="invite" fallback="disable">
          <InviteDialog />
        </PermissionGate>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead className="w-[80px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE_MEMBERS.map((member) => (
              <TableRow key={member.email}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={ROLE_VARIANT[member.role]}>
                      {member.role}
                    </Badge>
                    <PermissionGate action="manage_members" fallback="hide">
                      <Select defaultValue={member.role}>
                        <SelectTrigger size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </PermissionGate>
                  </div>
                </TableCell>
                <TableCell>{member.joinedAt}</TableCell>
                <TableCell>
                  <PermissionGate action="delete" fallback="hide">
                    <Button variant="ghost" size="xs" className="text-error-500">
                      삭제
                    </Button>
                  </PermissionGate>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
