"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ModuleGate } from "@/components/module-gate";

export default function CalendarPage() {
  return (
    <ModuleGate module="calendar">
      <PageHeader title="Calendar" description="Calendar 모듈" />
      <div>
        <p className="text-sm text-muted-foreground">여기에 calendar 모듈 UI를 구현하세요.</p>
      </div>
    </ModuleGate>
  );
}
