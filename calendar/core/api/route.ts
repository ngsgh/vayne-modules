import { NextResponse } from "next/server";
import { requireModule } from "@/lib/modules";

export async function GET() {
  requireModule("calendar");
  // v0.2.0: 오늘 날짜 기본 이벤트
  const today = new Date().toISOString().split("T")[0];
  return NextResponse.json({ data: [{ id: 1, date: today, title: "오늘의 일정" }] });
}

export async function POST(request: Request) {
  requireModule("calendar");
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}
