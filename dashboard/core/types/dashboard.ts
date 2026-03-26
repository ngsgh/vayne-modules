export type WidgetType = "kpi" | "line" | "bar" | "donut" | "activity";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  dataSourceId: string;
  title: string;
  /** react-grid-layout 좌표 */
  layout: { x: number; y: number; w: number; h: number };
}

export interface DashboardConfig {
  orgId: string;
  widgets: WidgetConfig[];
}

export type DataSourceType = "number" | "timeseries" | "distribution" | "list";

export interface DataSourceMeta {
  id: string;
  module: string;
  label: string;
  type: DataSourceType;
}

export interface DataSourceEntry extends DataSourceMeta {
  fetch: (orgId: string) => unknown;
}

export const WIDGET_TYPE_LABELS: Record<WidgetType, string> = {
  kpi: "KPI 카드",
  line: "라인 차트",
  bar: "바 차트",
  donut: "도넛 차트",
  activity: "최근 활동",
};

/** 위젯 타입별 허용 데이터 소스 타입 */
export const WIDGET_SOURCE_COMPAT: Record<WidgetType, DataSourceType[]> = {
  kpi: ["number"],
  line: ["timeseries"],
  bar: ["distribution"],
  donut: ["distribution"],
  activity: ["list"],
};
