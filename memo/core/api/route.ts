import { NextResponse } from "next/server";
import { requireModule } from "@/lib/modules";

export async function GET() {
  requireModule("memo");
  return NextResponse.json({ data: [] });
}

export async function POST(request: Request) {
  requireModule("memo");
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}
