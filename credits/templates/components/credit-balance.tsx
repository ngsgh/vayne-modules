"use client";

import { useCredits } from "@/hooks/use-credits";

import { RechargeDialog } from "./recharge-dialog";

export function CreditBalance() {
  const { balance } = useCredits();

  return (
    <div className="flex items-center justify-between rounded-lg border p-6">
      <div>
        <p className="text-sm text-muted-foreground">현재 잔액</p>
        <p className="text-4xl font-bold tracking-tight">
          {balance.toLocaleString()}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            크레딧
          </span>
        </p>
      </div>
      <RechargeDialog />
    </div>
  );
}
