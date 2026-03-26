import { NextResponse } from "next/server";

import {
  createCard, updateCard, deleteCard, moveCard,
  createColumn, deleteColumn, renameColumn,
  addCardComment, setWipLimit,
} from "@/lib/kanban";

import type { Subtask } from "@/types/kanban";

type PostBody = {
  action: string;
  columnId?: string;
  cardId?: string;
  targetColumnId?: string;
  targetOrder?: number;
  name?: string;
  color?: string;
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
  attachments?: string[];
  dueDate?: string | null;
  assigneeName?: string | null;
  subtasks?: Subtask[];
  authorName?: string;
  content?: string;
  wipLimit?: number | null;
};

function err(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export function handleKanbanAction(orgId: string, body: PostBody): NextResponse {
  switch (body.action) {
    case "createCard": {
      if (!body.columnId || !body.title) return err("columnId와 title은 필수입니다.");
      const card = createCard(orgId, body.columnId, {
        title: body.title, description: body.description,
        priority: body.priority, tags: body.tags,
        attachments: body.attachments, subtasks: body.subtasks,
        dueDate: body.dueDate, assigneeName: body.assigneeName,
      });
      return NextResponse.json(card, { status: 201 });
    }
    case "updateCard": {
      if (!body.cardId) return err("cardId는 필수입니다.");
      const updated = updateCard(orgId, body.cardId, {
        title: body.title, description: body.description,
        priority: body.priority, tags: body.tags,
        attachments: body.attachments, subtasks: body.subtasks,
        dueDate: body.dueDate, assigneeName: body.assigneeName,
      });
      return NextResponse.json(updated);
    }
    case "deleteCard": {
      if (!body.cardId) return err("cardId는 필수입니다.");
      deleteCard(orgId, body.cardId);
      return NextResponse.json({ success: true });
    }
    case "moveCard": {
      if (!body.cardId || !body.targetColumnId) return err("cardId와 targetColumnId는 필수입니다.");
      const moved = moveCard(orgId, body.cardId, body.targetColumnId, body.targetOrder ?? 0);
      return NextResponse.json(moved);
    }
    case "createColumn": {
      if (!body.name) return err("name은 필수입니다.");
      const col = createColumn(orgId, body.name, body.color ?? "bg-gray-500");
      return NextResponse.json(col, { status: 201 });
    }
    case "renameColumn": {
      if (!body.columnId || !body.name) return err("columnId와 name은 필수입니다.");
      renameColumn(orgId, body.columnId, body.name);
      return NextResponse.json({ success: true });
    }
    case "deleteColumn": {
      if (!body.columnId) return err("columnId는 필수입니다.");
      deleteColumn(orgId, body.columnId);
      return NextResponse.json({ success: true });
    }
    case "addComment": {
      if (!body.cardId || !body.authorName || !body.content) {
        return err("cardId, authorName, content는 필수입니다.");
      }
      const comment = addCardComment(orgId, body.cardId, body.authorName, body.content);
      return NextResponse.json(comment, { status: 201 });
    }
    case "setWipLimit": {
      if (!body.columnId) return err("columnId는 필수입니다.");
      setWipLimit(orgId, body.columnId, body.wipLimit ?? null);
      return NextResponse.json({ success: true });
    }
    default:
      return err("알 수 없는 action입니다.");
  }
}
