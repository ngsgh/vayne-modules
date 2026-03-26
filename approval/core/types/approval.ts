export type ApprovalStatus = "draft" | "pending" | "approved" | "rejected";
export type StepStatus = "pending" | "approved" | "rejected";

export type ApprovalCategory = "general" | "expense" | "leave" | "purchase";

export interface ApprovalStep {
  id: string;
  order: number;
  approverId: string;
  approverName: string;
  status: StepStatus;
  comment: string;
  decidedAt: string | null;
}

export interface ApprovalDocument {
  id: string;
  orgId: string;
  title: string;
  content: string;
  category: ApprovalCategory;
  authorId: string;
  authorName: string;
  status: ApprovalStatus;
  steps: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

export const APPROVAL_CATEGORY_LABELS: Record<ApprovalCategory, string> = {
  general: "일반",
  expense: "지출",
  leave: "휴가",
  purchase: "구매",
};

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  draft: "임시저장",
  pending: "결재 중",
  approved: "승인",
  rejected: "반려",
};
