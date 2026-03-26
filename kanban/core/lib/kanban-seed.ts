import { getColumns, createCard } from "./kanban";

export function seedSampleCards(orgId: string): void {
  const orgCols = getColumns(orgId);
  if (orgCols.length < 4) return;

  createCard(orgId, orgCols[0].id, {
    title: "프로젝트 기획서 작성",
    description: "Q2 신규 프로젝트 기획서를 작성합니다.",
    priority: "high",
    tags: ["기획"],
    dueDate: "2026-04-05",
    assigneeName: "홍길동",
    subtasks: [
      { id: "st-1", title: "시장 조사", done: true },
      { id: "st-2", title: "경쟁사 분석", done: false },
      { id: "st-3", title: "초안 작성", done: false },
    ],
  });
  createCard(orgId, orgCols[0].id, {
    title: "디자인 시안 검토",
    description: "UI/UX 디자인 시안을 검토합니다.",
    priority: "medium",
    tags: ["디자인"],
    dueDate: "2026-04-10",
    assigneeName: "김철수",
  });
  createCard(orgId, orgCols[1].id, {
    title: "API 개발",
    description: "REST API 엔드포인트를 구현합니다.",
    priority: "urgent",
    tags: ["개발", "백엔드"],
    dueDate: "2026-03-28",
    assigneeName: "이영희",
  });
  createCard(orgId, orgCols[2].id, {
    title: "코드 리뷰",
    description: "PR 코드 리뷰를 진행합니다.",
    priority: "low",
    tags: ["리뷰"],
    assigneeName: "홍길동",
  });
  createCard(orgId, orgCols[3].id, {
    title: "v1.0 릴리즈 노트",
    description: "릴리즈 노트를 작성하고 배포합니다.",
    priority: "medium",
    tags: ["문서"],
    dueDate: "2026-03-25",
    assigneeName: "김철수",
  });
}
