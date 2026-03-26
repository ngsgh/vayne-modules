export type KanbanColumnId = string;

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

export const DEFAULT_COLUMNS: { name: string; color: string }[] = [
  { name: "할 일", color: "bg-gray-500" },
  { name: "진행 중", color: "bg-blue-500" },
  { name: "검토", color: "bg-yellow-500" },
  { name: "완료", color: "bg-green-500" },
];
