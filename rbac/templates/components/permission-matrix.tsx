import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROLES = ["소유자", "관리자", "멤버", "뷰어"] as const;

type Permission = {
  resource: string;
  access: Record<(typeof ROLES)[number], boolean>;
};

const PERMISSIONS: Permission[] = [
  {
    resource: "대시보드",
    access: { 소유자: true, 관리자: true, 멤버: true, 뷰어: true },
  },
  {
    resource: "멤버 관리",
    access: { 소유자: true, 관리자: true, 멤버: false, 뷰어: false },
  },
  {
    resource: "설정",
    access: { 소유자: true, 관리자: true, 멤버: false, 뷰어: false },
  },
  {
    resource: "데이터",
    access: { 소유자: true, 관리자: true, 멤버: true, 뷰어: false },
  },
  {
    resource: "파일",
    access: { 소유자: true, 관리자: true, 멤버: true, 뷰어: true },
  },
];

function AccessCell({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Badge variant="default">&#10003;</Badge>
  ) : (
    <Badge variant="secondary">&mdash;</Badge>
  );
}

export function PermissionMatrix() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">권한 매트릭스</h2>
        <p className="text-sm text-muted-foreground">
          역할별 리소스 접근 권한 현황
        </p>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>리소스</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role} className="text-center">
                  {role}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSIONS.map((perm) => (
              <TableRow key={perm.resource}>
                <TableCell className="font-medium">
                  {perm.resource}
                </TableCell>
                {ROLES.map((role) => (
                  <TableCell key={role} className="text-center">
                    <AccessCell allowed={perm.access[role]} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
