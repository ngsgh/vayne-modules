import { NextResponse } from "next/server";

import {
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  createColumn,
  deleteColumn,
} from "@/lib/kanban";

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
  assigneeName?: string | null;
};

export function handleKanbanAction(
  orgId: string,
  body: PostBody,
): NextResponse {
  switch (body.action) {
    case "createCard": {
      if (!body.columnId || !body.title) {
        return NextResponse.json(
          { error: "columnId와 title은 필수입니다." },
          { status: 400 },
        );
      }
      const card = createCard(orgId, body.columnId, {
        title: body.title,
        description: body.description,
        priority: body.priority,
        tags: body.tags,
        assigneeName: body.assigneeName,
      });
      return NextResponse.json(card, { status: 201 });
    }
    case "updateCard": {
      if (!body.cardId) {
        return NextResponse.json(
          { error: "cardId는 필수입니다." },
          { status: 400 },
        );
      }
      const updated = updateCard(orgId, body.cardId, {
        title: body.title,
        description: body.description,
        priority: body.priority,
        tags: body.tags,
        assigneeName: body.assigneeName,
      });
      return NextResponse.json(updated);
    }
    case "deleteCard": {
      if (!body.cardId) {
        return NextResponse.json(
          { error: "cardId는 필수입니다." },
          { status: 400 },
        );
      }
      deleteCard(orgId, body.cardId);
      return NextResponse.json({ success: true });
    }
    case "moveCard": {
      if (!body.cardId || !body.targetColumnId) {
        return NextResponse.json(
          { error: "cardId와 targetColumnId는 필수입니다." },
          { status: 400 },
        );
      }
      const moved = moveCard(
        orgId,
        body.cardId,
        body.targetColumnId,
        body.targetOrder ?? 0,
      );
      return NextResponse.json(moved);
    }
    case "createColumn": {
      if (!body.name) {
        return NextResponse.json(
          { error: "name은 필수입니다." },
          { status: 400 },
        );
      }
      const col = createColumn(orgId, body.name, body.color ?? "bg-gray-500");
      return NextResponse.json(col, { status: 201 });
    }
    case "deleteColumn": {
      if (!body.columnId) {
        return NextResponse.json(
          { error: "columnId는 필수입니다." },
          { status: 400 },
        );
      }
      deleteColumn(orgId, body.columnId);
      return NextResponse.json({ success: true });
    }
    default:
      return NextResponse.json(
        { error: "알 수 없는 action입니다." },
        { status: 400 },
      );
  }
}
