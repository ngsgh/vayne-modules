"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ModuleGate } from "@/components/module-gate";

export default function MemoPage() {
  return (
    <ModuleGate module="memo">
      <PageHeader title="Memo" description="Memo 모듈" />
      <div>
        <p className="text-sm text-muted-foreground">여기에 memo 모듈 UI를 구현하세요.</p>
      </div>
    </ModuleGate>
  );
}
