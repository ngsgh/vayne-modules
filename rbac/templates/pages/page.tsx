import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MembersTable } from "./members-table";
import { PermissionMatrix } from "./permission-matrix";
import { RoleSwitcher } from "./role-switcher";

type Role = {
  name: string;
  description: string;
  level: string;
  capabilities: string[];
};

const ROLES: Role[] = [
  {
    name: "소유자",
    description: "워크스페이스의 모든 권한을 보유합니다.",
    level: "최고 관리자",
    capabilities: ["모든 설정", "멤버 관리", "결제 관리", "데이터 삭제"],
  },
  {
    name: "관리자",
    description: "멤버 및 설정을 관리할 수 있습니다.",
    level: "관리자",
    capabilities: ["멤버 관리", "설정 변경", "데이터 편집"],
  },
  {
    name: "멤버",
    description: "데이터를 조회하고 편집할 수 있습니다.",
    level: "일반",
    capabilities: ["데이터 조회", "데이터 편집", "파일 업로드"],
  },
  {
    name: "뷰어",
    description: "데이터를 조회만 할 수 있습니다.",
    level: "읽기 전용",
    capabilities: ["데이터 조회", "파일 다운로드"],
  },
];

function RolesTable() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>역할</TableHead>
            <TableHead>설명</TableHead>
            <TableHead>권한 수준</TableHead>
            <TableHead>기능</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROLES.map((role) => (
            <TableRow key={role.name}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <Badge variant="secondary">{role.level}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function RolesPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="권한 관리" description="역할별 접근 권한 설정" />
      <RoleSwitcher />
      <RolesTable />
      <MembersTable />
      <PermissionMatrix />
    </div>
  );
}
