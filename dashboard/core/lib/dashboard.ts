// dashboard 모듈 비즈니스 로직
// 코어 영역 — vayne-cli update 시 덮어쓰기 대상

import type { DashboardConfig, WidgetConfig } from "@/types/dashboard";

const configs = new Map<string, DashboardConfig>();

function defaultWidgets(): WidgetConfig[] {
  return [
    {
      id: "w1",
      type: "kpi",
      dataSourceId: "board_post_count",
      title: "게시글",
      layout: { x: 0, y: 0, w: 3, h: 2 },
    },
    {
      id: "w2",
      type: "kpi",
      dataSourceId: "kanban_card_count",
      title: "칸반 카드",
      layout: { x: 3, y: 0, w: 3, h: 2 },
    },
    {
      id: "w3",
      type: "kpi",
      dataSourceId: "member_count",
      title: "멤버",
      layout: { x: 6, y: 0, w: 3, h: 2 },
    },
    {
      id: "w4",
      type: "kpi",
      dataSourceId: "credit_balance",
      title: "크레딧 잔액",
      layout: { x: 9, y: 0, w: 3, h: 2 },
    },
    {
      id: "w5",
      type: "bar",
      dataSourceId: "board_category_dist",
      title: "카테고리별 게시글",
      layout: { x: 0, y: 2, w: 6, h: 4 },
    },
    {
      id: "w6",
      type: "donut",
      dataSourceId: "kanban_column_dist",
      title: "칸반 상태별 카드",
      layout: { x: 6, y: 2, w: 6, h: 4 },
    },
  ];
}

export function getDashboardConfig(orgId: string): DashboardConfig {
  if (!configs.has(orgId)) {
    configs.set(orgId, { orgId, widgets: defaultWidgets() });
  }
  return configs.get(orgId)!;
}

export function saveDashboardConfig(
  orgId: string,
  widgets: WidgetConfig[],
): DashboardConfig {
  const config = { orgId, widgets };
  configs.set(orgId, config);
  return config;
}
