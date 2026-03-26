import { NextResponse } from "next/server";
import { requireModule } from "@/lib/modules";

export async function GET() {
  requireModule("calendar");
  return NextResponse.json({ data: [] });
}

export async function POST(request: Request) {
  requireModule("calendar");
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}
