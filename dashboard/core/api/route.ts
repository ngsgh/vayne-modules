import { NextResponse } from "next/server";

import { requireOrg } from "@/lib/auth";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import { getDashboardConfig, saveDashboardConfig } from "@/lib/dashboard";
import { getDataSources, fetchDataSource } from "@/lib/dashboard-sources";
import { seedDashboardSources } from "@/lib/dashboard-seed";
import type { WidgetConfig } from "@/types/dashboard";

export async function GET() {
  try {
    requireModule("dashboard");
    const user = await requireOrg();
    seedDashboardSources();

    const config = getDashboardConfig(user.orgId);
    const sources = getDataSources();

    const widgetData: Record<string, unknown> = {};
    for (const w of config.widgets) {
      widgetData[w.id] = fetchDataSource(w.dataSourceId, user.orgId);
    }

    return NextResponse.json({ config, sources, widgetData });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("대시보드 조회 실패");
    return NextResponse.json(
      { error: "대시보드를 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    requireModule("dashboard");
    const user = await requireOrg();

    const body = (await request.json()) as { widgets: WidgetConfig[] };
    const config = saveDashboardConfig(user.orgId, body.widgets);

    return NextResponse.json({ config });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("대시보드 저장 실패");
    return NextResponse.json(
      { error: "대시보드 저장에 실패했습니다" },
      { status: 500 },
    );
  }
}
