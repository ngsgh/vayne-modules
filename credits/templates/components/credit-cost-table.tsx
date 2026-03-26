"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CREDIT_ACTION_LABELS,
  CREDIT_COSTS,
} from "@/types/credit";
import type { CreditAction } from "@/types/credit";

const ACTIONS = Object.keys(CREDIT_COSTS) as CreditAction[];

export function CreditCostTable() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">액션별 크레딧 비용</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>액션</TableHead>
              <TableHead className="w-[140px] text-right">
                크레딧 비용
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIONS.map((action) => (
              <TableRow key={action}>
                <TableCell>{CREDIT_ACTION_LABELS[action]}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">
                    {CREDIT_COSTS[action]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
