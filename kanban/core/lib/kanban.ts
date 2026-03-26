import type { KanbanCard, KanbanColumn, CardComment } from "@/types/kanban";
import { DEFAULT_COLUMNS } from "@/types/kanban";

const columns: KanbanColumn[] = [];
const cards: KanbanCard[] = [];
let columnIdCounter = 0;
let cardIdCounter = 0;
let commentIdCounter = 0;

function genColumnId(): string { return `col-${++columnIdCounter}`; }
function genCardId(): string { return `card-${++cardIdCounter}`; }
function genCommentId(): string { return `comment-${++commentIdCounter}`; }
function now(): string { return new Date().toISOString(); }

export function getColumns(orgId: string): KanbanColumn[] {
  return columns.filter((c) => c.orgId === orgId).sort((a, b) => a.order - b.order);
}

export function createColumn(orgId: string, name: string, color: string): KanbanColumn {
  const order = columns.filter((c) => c.orgId === orgId).length;
  const col: KanbanColumn = { id: genColumnId(), orgId, name, order, color, wipLimit: null };
  columns.push(col);
  return col;
}

export function deleteColumn(orgId: string, columnId: string): void {
  const idx = columns.findIndex((c) => c.id === columnId && c.orgId === orgId);
  if (idx !== -1) columns.splice(idx, 1);
  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].columnId === columnId && cards[i].orgId === orgId) cards.splice(i, 1);
  }
}

export function renameColumn(orgId: string, columnId: string, name: string): void {
  const col = columns.find((c) => c.id === columnId && c.orgId === orgId);
  if (col) col.name = name;
}

export function setWipLimit(orgId: string, columnId: string, limit: number | null): void {
  const col = columns.find((c) => c.id === columnId && c.orgId === orgId);
  if (col) col.wipLimit = limit;
}

export function getCards(orgId: string, columnId?: string): KanbanCard[] {
  return cards
    .filter((c) => c.orgId === orgId && (columnId ? c.columnId === columnId : true))
    .sort((a, b) => a.order - b.order);
}

export function createCard(
  orgId: string,
  columnId: string,
  data: {
    title: string;
    description?: string;
    priority?: KanbanCard["priority"];
    tags?: string[];
    attachments?: string[];
    subtasks?: KanbanCard["subtasks"];
    dueDate?: string | null;
    assigneeId?: string | null;
    assigneeName?: string | null;
  },
): KanbanCard {
  const order = cards.filter((c) => c.orgId === orgId && c.columnId === columnId).length;
  const card: KanbanCard = {
    id: genCardId(), orgId, columnId,
    title: data.title,
    description: data.description ?? "",
    assigneeId: data.assigneeId ?? null,
    assigneeName: data.assigneeName ?? null,
    priority: data.priority ?? "medium",
    tags: data.tags ?? [],
    attachments: data.attachments ?? [],
    subtasks: data.subtasks ?? [],
    comments: [],
    dueDate: data.dueDate ?? null,
    order, createdAt: now(), updatedAt: now(),
  };
  cards.push(card);
  return card;
}

export function updateCard(
  orgId: string, cardId: string,
  data: Partial<Pick<KanbanCard,
    "title" | "description" | "priority" | "tags" | "attachments" | "subtasks" | "dueDate" | "assigneeName"
  >>,
): KanbanCard | null {
  const card = cards.find((c) => c.id === cardId && c.orgId === orgId);
  if (!card) return null;
  Object.assign(card, data, { updatedAt: now() });
  return card;
}

export function deleteCard(orgId: string, cardId: string): void {
  const idx = cards.findIndex((c) => c.id === cardId && c.orgId === orgId);
  if (idx !== -1) cards.splice(idx, 1);
}

export function moveCard(
  orgId: string, cardId: string, targetColumnId: string, targetOrder: number,
): KanbanCard | null {
  const card = cards.find((c) => c.id === cardId && c.orgId === orgId);
  if (!card) return null;
  card.columnId = targetColumnId;
  card.order = targetOrder;
  card.updatedAt = now();
  return card;
}

export function addCardComment(
  orgId: string, cardId: string, authorName: string, content: string,
): CardComment | null {
  const card = cards.find((c) => c.id === cardId && c.orgId === orgId);
  if (!card) return null;
  const comment: CardComment = { id: genCommentId(), authorName, content, createdAt: now() };
  card.comments.push(comment);
  card.updatedAt = now();
  return comment;
}

export function initDefaultColumns(orgId: string): void {
  const existing = columns.filter((c) => c.orgId === orgId);
  if (existing.length > 0) return;
  DEFAULT_COLUMNS.forEach((col) => createColumn(orgId, col.name, col.color));
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { seedSampleCards } = require("./kanban-seed");
  seedSampleCards(orgId);
}
