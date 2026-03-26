"use client";

import { PageHeader } from "@/components/layout/page-header";

import { CreditBalance } from "./credit-balance";
import { CreditCostTable } from "./credit-cost-table";
import { TransactionHistory } from "./transaction-history";

export default function CreditsPage() {
  return (
    <div>
      <PageHeader
        title="크레딧 관리"
        description="크레딧 잔액 및 사용 내역"
      />

      <div className="space-y-8">
        <CreditBalance />
        <CreditCostTable />
        <TransactionHistory />
      </div>
    </div>
  );
}
