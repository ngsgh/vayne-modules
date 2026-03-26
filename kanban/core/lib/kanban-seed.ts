import { getColumns, createCard } from "./kanban";

export function seedSampleCards(orgId: string): void {
  const orgCols = getColumns(orgId);
  if (orgCols.length < 3) return;

  createCard(orgId, orgCols[0].id, {
    title: "프로젝트 기획서 작성",
    description: "Q2 신규 프로젝트 기획서를 작성합니다.",
    priority: "high",
    tags: ["기획"],
  });
  createCard(orgId, orgCols[0].id, {
    title: "디자인 시안 검토",
    description: "UI/UX 디자인 시안을 검토합니다.",
    priority: "medium",
    tags: ["디자인"],
  });
  createCard(orgId, orgCols[1].id, {
    title: "API 개발",
    description: "REST API 엔드포인트를 구현합니다.",
    priority: "urgent",
    tags: ["개발", "백엔드"],
  });
  createCard(orgId, orgCols[2].id, {
    title: "코드 리뷰",
    description: "PR 코드 리뷰를 진행합니다.",
    priority: "low",
    tags: ["리뷰"],
  });
}
