import { NextResponse } from "next/server";
import { requireModule } from "@/lib/modules";

export async function GET() {
  requireModule("todo");
  // v0.2.0: 기본 데이터 추가
  return NextResponse.json({ data: [{ id: 1, title: "샘플 할일", done: false }] });
}

export async function POST(request: Request) {
  requireModule("todo");
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}
