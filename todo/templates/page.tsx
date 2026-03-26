"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ModuleGate } from "@/components/module-gate";

export default function TodoPage() {
  return (
    <ModuleGate module="todo">
      <PageHeader title="Todo" description="Todo 모듈" />
      <div>
        <p className="text-sm text-muted-foreground">여기에 todo 모듈 UI를 구현하세요.</p>
      </div>
    </ModuleGate>
  );
}
