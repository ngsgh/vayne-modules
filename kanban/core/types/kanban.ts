export type KanbanColumnId = string;

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface CardComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface KanbanCard {
  id: string;
  orgId: string;
  columnId: KanbanColumnId;
  title: string;
  description: string;
  assigneeId: string | null;
  assigneeName: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  attachments: string[];
  subtasks: Subtask[];
  comments: CardComment[];
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: KanbanColumnId;
  orgId: string;
  name: string;
  order: number;
  color: string;
  wipLimit: number | null;
}

export type DueDateStatus = "normal" | "soon" | "overdue";

export function getDueDateStatus(dueDate: string | null): DueDateStatus {
  if (!dueDate) return "normal";
  const now = new Date();
  const due = new Date(dueDate);
  if (due < now) return "overdue";
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays <= 2) return "soon";
  return "normal";
}

export const PRIORITY_LABELS: Record<KanbanCard["priority"], string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "긴급",
};

export const PRIORITY_COLORS: Record<KanbanCard["priority"], string> = {
  low: "text-muted-foreground",
  medium: "text-blue-600",
  high: "text-orange-600",
  urgent: "text-red-600",
};

export const PRIORITY_BAR_COLORS: Record<KanbanCard["priority"], string> = {
  low: "bg-gray-300 dark:bg-gray-600",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

export const DEFAULT_COLUMNS: { name: string; color: string }[] = [
  { name: "할 일", color: "bg-gray-500" },
  { name: "진행 중", color: "bg-blue-500" },
  { name: "검토", color: "bg-yellow-500" },
  { name: "완료", color: "bg-green-500" },
];
