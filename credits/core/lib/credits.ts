import type { CreditAction, CreditTransaction } from "@/types/credit";
import { CREDIT_COSTS } from "@/types/credit";

let balance = 1000;
const transactions: CreditTransaction[] = [];
let seeded = false;

function seed(): void {
  if (seeded) return;
  seeded = true;

  const samples: Array<{
    action: CreditAction;
    amount: number;
    description: string;
  }> = [
    { action: "generate", amount: -10, description: "이미지 생성" },
    { action: "ai_request", amount: -15, description: "AI 문서 요약" },
    { action: "download", amount: -2, description: "보고서 다운로드" },
    { action: "upload", amount: -5, description: "파일 업로드" },
  ];

  let runningBalance = 1032;
  for (const s of samples) {
    runningBalance += s.amount;
    transactions.push({
      id: crypto.randomUUID(),
      action: s.action,
      amount: s.amount,
      description: s.description,
      createdAt: new Date(
        Date.now() - transactions.length * 3600_000,
      ).toISOString(),
      balance: runningBalance,
    });
  }
}

export function getBalance(): number {
  seed();
  return balance;
}

export function getTransactions(): CreditTransaction[] {
  seed();
  return transactions.toSorted(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function hasEnoughCredits(action: CreditAction): boolean {
  seed();
  return balance >= CREDIT_COSTS[action];
}

export function deductCredits(
  action: CreditAction,
  description?: string,
): { success: boolean; remaining: number } {
  seed();
  const cost = CREDIT_COSTS[action];

  if (balance < cost) {
    return { success: false, remaining: balance };
  }

  balance -= cost;

  transactions.push({
    id: crypto.randomUUID(),
    action,
    amount: -cost,
    description: description ?? `${action} 사용`,
    createdAt: new Date().toISOString(),
    balance,
  });

  return { success: true, remaining: balance };
}

export function addCredits(
  amount: number,
  description?: string,
): number {
  seed();
  balance += amount;

  transactions.push({
    id: crypto.randomUUID(),
    action: "generate", // recharge는 action 타입이 아니므로 기본값
    amount,
    description: description ?? "크레딧 충전",
    createdAt: new Date().toISOString(),
    balance,
  });

  return balance;
}
