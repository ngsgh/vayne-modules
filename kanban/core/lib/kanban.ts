import type { KanbanCard, KanbanColumn } from "@/types/kanban";
import { DEFAULT_COLUMNS } from "@/types/kanban";

const columns: KanbanColumn[] = [];
const cards: KanbanCard[] = [];

let columnIdCounter = 0;
let cardIdCounter = 0;

function genColumnId(): string {
  columnIdCounter += 1;
  return `col-${columnIdCounter}`;
}

function genCardId(): string {
  cardIdCounter += 1;
  return `card-${cardIdCounter}`;
}

function now(): string {
  return new Date().toISOString();
}

export function getColumns(orgId: string): KanbanColumn[] {
  return columns
    .filter((c) => c.orgId === orgId)
    .sort((a, b) => a.order - b.order);
}

export function createColumn(
  orgId: string,
  name: string,
  color: string,
): KanbanColumn {
  const order = columns.filter((c) => c.orgId === orgId).length;
  const col: KanbanColumn = { id: genColumnId(), orgId, name, order, color };
  columns.push(col);
  return col;
}

export function deleteColumn(orgId: string, columnId: string): void {
  const idx = columns.findIndex(
    (c) => c.id === columnId && c.orgId === orgId,
  );
  if (idx !== -1) columns.splice(idx, 1);

  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].columnId === columnId && cards[i].orgId === orgId) {
      cards.splice(i, 1);
    }
  }
}

export function getCards(orgId: string, columnId?: string): KanbanCard[] {
  return cards
    .filter(
      (c) => c.orgId === orgId && (columnId ? c.columnId === columnId : true),
    )
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
    assigneeId?: string | null;
    assigneeName?: string | null;
  },
): KanbanCard {
  const order = cards.filter(
    (c) => c.orgId === orgId && c.columnId === columnId,
  ).length;
  const card: KanbanCard = {
    id: genCardId(),
    orgId,
    columnId,
    title: data.title,
    description: data.description ?? "",
    assigneeId: data.assigneeId ?? null,
    assigneeName: data.assigneeName ?? null,
    priority: data.priority ?? "medium",
    tags: data.tags ?? [],
    order,
    createdAt: now(),
    updatedAt: now(),
  };
  cards.push(card);
  return card;
}

export function updateCard(
  orgId: string,
  cardId: string,
  data: Partial<
    Pick<
      KanbanCard,
      "title" | "description" | "priority" | "tags" | "assigneeName"
    >
  >,
): KanbanCard | null {
  const card = cards.find((c) => c.id === cardId && c.orgId === orgId);
  if (!card) return null;
  Object.assign(card, data, { updatedAt: now() });
  return card;
}

export function deleteCard(orgId: string, cardId: string): void {
  const idx = cards.findIndex(
    (c) => c.id === cardId && c.orgId === orgId,
  );
  if (idx !== -1) cards.splice(idx, 1);
}

export function moveCard(
  orgId: string,
  cardId: string,
  targetColumnId: string,
  targetOrder: number,
): KanbanCard | null {
  const card = cards.find((c) => c.id === cardId && c.orgId === orgId);
  if (!card) return null;
  card.columnId = targetColumnId;
  card.order = targetOrder;
  card.updatedAt = now();
  return card;
}

export function initDefaultColumns(orgId: string): void {
  const existing = columns.filter((c) => c.orgId === orgId);
  if (existing.length > 0) return;

  DEFAULT_COLUMNS.forEach((col) => {
    createColumn(orgId, col.name, col.color);
  });

  // Lazy-import seed to keep this file under 150 lines
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { seedSampleCards } = require("./kanban-seed");
  seedSampleCards(orgId);
}
