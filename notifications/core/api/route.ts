import { NextResponse } from "next/server";

import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/lib/notifications";
import { requireModule, ModuleDisabledError } from "@/lib/modules";

export async function GET() {
  try {
    requireModule("notifications");
    const notifications = getNotifications();
    const unreadCount = getUnreadCount();
    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("알림 조회 실패:", err);
    return NextResponse.json(
      { error: "알림을 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}

type MarkReadBody = { id: string } | { all: true };

export async function POST(request: Request) {
  try {
    requireModule("notifications");
    const body = (await request.json()) as MarkReadBody;

    if ("all" in body && body.all) {
      markAllAsRead();
    } else if ("id" in body && body.id) {
      markAsRead(body.id);
    } else {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("알림 읽음 처리 실패:", err);
    return NextResponse.json(
      { error: "알림 처리에 실패했습니다" },
      { status: 500 },
    );
  }
}
