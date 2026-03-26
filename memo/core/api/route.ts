import { NextResponse } from "next/server";
import { requireModule } from "@/lib/modules";

export async function GET() {
  requireModule("memo");
  // v0.3.0: 고정 메모 + 즐겨찾기 지원
  return NextResponse.json({
    data: [],
    pinned: [],
    favorites: [],
  });
}

export async function POST(request: Request) {
  requireModule("memo");
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}
