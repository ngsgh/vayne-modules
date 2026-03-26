import { NextResponse } from "next/server";

import { requireOrg } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/calendar";
import type { CreateEventInput, UpdateEventInput } from "@/types/calendar";

export async function GET() {
  try {
    requireModule("calendar");
    const user = await requireOrg();

    const events = getEvents(user.orgId);
    return NextResponse.json({ events });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("일정 조회 실패");
    return NextResponse.json(
      { error: "일정을 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}

type PostBody =
  | { action: "create"; event: CreateEventInput }
  | { action: "update"; eventId: string; event: UpdateEventInput }
  | { action: "delete"; eventId: string };

export async function POST(request: Request) {
  try {
    requireModule("calendar");
    const user = await requireOrg();
    const body = (await request.json()) as PostBody;

    if (body.action === "create") {
      const event = createEvent(user.orgId, body.event);
      return NextResponse.json(event, { status: 201 });
    }

    if (body.action === "update") {
      const event = updateEvent(user.orgId, body.eventId, body.event);
      if (!event) {
        return NextResponse.json(
          { error: "일정을 찾을 수 없습니다" },
          { status: 404 },
        );
      }
      return NextResponse.json(event);
    }

    if (body.action === "delete") {
      const ok = deleteEvent(user.orgId, body.eventId);
      if (!ok) {
        return NextResponse.json(
          { error: "일정을 찾을 수 없습니다" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "잘못된 요청입니다" },
      { status: 400 },
    );
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("일정 처리 실패");
    return NextResponse.json(
      { error: "일정 처리에 실패했습니다" },
      { status: 500 },
    );
  }
}
