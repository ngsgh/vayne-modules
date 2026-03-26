// approval 모듈 비즈니스 로직
// 코어 영역 — vayne-cli update 시 덮어쓰기 대상

import type {
  ApprovalDocument,
  ApprovalStep,
  ApprovalCategory,
  StepStatus,
} from "@/types/approval";

const documents: ApprovalDocument[] = [];
const seeded = new Set<string>();

function seed(orgId: string): void {
  if (seeded.has(orgId)) return;
  seeded.add(orgId);

  const now = new Date();
  const samples: Array<{
    title: string;
    content: string;
    category: ApprovalCategory;
    steps: Array<{ name: string; status: StepStatus; comment: string }>;
    status: ApprovalDocument["status"];
  }> = [
    {
      title: "3월 마케팅 비용 집행",
      content: "SNS 광고비 500만원 집행 요청합니다.",
      category: "expense",
      steps: [
        { name: "팀장 김OO", status: "approved", comment: "승인합니다" },
        { name: "부장 이OO", status: "approved", comment: "" },
        { name: "이사 박OO", status: "pending", comment: "" },
      ],
      status: "pending",
    },
    {
      title: "연차 사용 신청 (4/1~4/3)",
      content: "개인 사유로 연차 3일 사용 신청합니다.",
      category: "leave",
      steps: [
        { name: "팀장 김OO", status: "approved", comment: "승인" },
      ],
      status: "approved",
    },
    {
      title: "노트북 구매 요청",
      content: "신규 입사자용 MacBook Pro 1대 구매 요청",
      category: "purchase",
      steps: [
        { name: "팀장 김OO", status: "rejected", comment: "예산 초과입니다" },
      ],
      status: "rejected",
    },
  ];

  for (const s of samples) {
    documents.push({
      id: crypto.randomUUID(),
      orgId,
      title: s.title,
      content: s.content,
      category: s.category,
      authorId: "template-user-001",
      authorName: "관리자",
      status: s.status,
      steps: s.steps.map((step, i) => ({
        id: crypto.randomUUID(),
        order: i,
        approverId: `approver-${i}`,
        approverName: step.name,
        status: step.status,
        comment: step.comment,
        decidedAt: step.status !== "pending" ? now.toISOString() : null,
      })),
      createdAt: new Date(now.getTime() - (2 - samples.indexOf(s)) * 86400_000).toISOString(),
      updatedAt: now.toISOString(),
    });
  }
}

export function getDocuments(orgId: string): ApprovalDocument[] {
  seed(orgId);
  return documents
    .filter((d) => d.orgId === orgId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getDocument(
  orgId: string,
  docId: string,
): ApprovalDocument | null {
  seed(orgId);
  return documents.find((d) => d.id === docId && d.orgId === orgId) ?? null;
}

export function createDocument(
  orgId: string,
  input: {
    title: string;
    content: string;
    category: ApprovalCategory;
    authorId: string;
    authorName: string;
    steps: Array<{ approverId: string; approverName: string }>;
  },
): ApprovalDocument {
  const doc: ApprovalDocument = {
    id: crypto.randomUUID(),
    orgId,
    title: input.title,
    content: input.content,
    category: input.category,
    authorId: input.authorId,
    authorName: input.authorName,
    status: "pending",
    steps: input.steps.map((s, i) => ({
      id: crypto.randomUUID(),
      order: i,
      approverId: s.approverId,
      approverName: s.approverName,
      status: "pending" as StepStatus,
      comment: "",
      decidedAt: null,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  documents.push(doc);
  return doc;
}

export function decideStep(
  orgId: string,
  docId: string,
  stepId: string,
  decision: "approved" | "rejected",
  comment: string,
): ApprovalDocument | null {
  const doc = getDocument(orgId, docId);
  if (!doc) return null;

  const step = doc.steps.find((s) => s.id === stepId);
  if (!step || step.status !== "pending") return null;

  step.status = decision;
  step.comment = comment;
  step.decidedAt = new Date().toISOString();
  doc.updatedAt = new Date().toISOString();

  if (decision === "rejected") {
    doc.status = "rejected";
  } else if (doc.steps.every((s) => s.status === "approved")) {
    doc.status = "approved";
  }

  return doc;
}
