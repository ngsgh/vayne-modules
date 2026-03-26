"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCredits } from "@/hooks/use-credits";
import { CREDIT_ACTION_LABELS } from "@/types/credit";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TransactionHistory() {
  const { transactions } = useCredits();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">사용 내역</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 거래 내역이 없습니다.
        </p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>액션</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="w-[100px] text-right">금액</TableHead>
                <TableHead className="w-[100px] text-right">잔액</TableHead>
                <TableHead className="w-[160px] text-right">날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{CREDIT_ACTION_LABELS[tx.action]}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {tx.description}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {tx.amount > 0 ? (
                      <span className="text-success-500">
                        +{tx.amount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-error-500">
                        {tx.amount.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDate(tx.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
