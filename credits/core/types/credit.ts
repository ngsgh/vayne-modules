export type CreditAction =
  | "generate"
  | "download"
  | "upload"
  | "export"
  | "ai_request";

export interface CreditTransaction {
  id: string;
  action: CreditAction;
  amount: number; // negative = deduction, positive = recharge
  description: string;
  createdAt: string; // ISO date
  balance: number; // balance after transaction
}

export const CREDIT_COSTS: Record<CreditAction, number> = {
  generate: 10,
  download: 2,
  upload: 5,
  export: 3,
  ai_request: 15,
};

export const CREDIT_ACTION_LABELS: Record<CreditAction, string> = {
  generate: "생성",
  download: "다운로드",
  upload: "업로드",
  export: "내보내기",
  ai_request: "AI 요청",
};
