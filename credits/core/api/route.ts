import { NextResponse } from "next/server";

import {
  addCredits,
  getBalance,
  getTransactions,
  deductCredits,
} from "@/lib/credits";
import { requireModule, ModuleDisabledError } from "@/lib/modules";
import type { CreditAction } from "@/types/credit";

export async function GET() {
  try {
    requireModule("credits");
    const balance = getBalance();
    const transactions = getTransactions();
    return NextResponse.json({ balance, transactions });
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("크레딧 조회 실패");
    return NextResponse.json(
      { error: "크레딧을 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}

type UseBody = {
  action: "use";
  creditAction: CreditAction;
  description?: string;
};

type RechargeBody = {
  action: "recharge";
  amount: number;
};

export async function POST(request: Request) {
  try {
    requireModule("credits");
    const body = (await request.json()) as UseBody | RechargeBody;

    if (body.action === "use") {
      const result = deductCredits(body.creditAction, body.description);
      if (!result.success) {
        return NextResponse.json(
          { error: "크레딧이 부족합니다" },
          { status: 400 },
        );
      }
      return NextResponse.json({
        success: true,
        remaining: result.remaining,
      });
    }

    if (body.action === "recharge") {
      const newBalance = addCredits(body.amount);
      return NextResponse.json({ success: true, balance: newBalance });
    }

    return NextResponse.json(
      { error: "잘못된 요청 형식입니다" },
      { status: 400 },
    );
  } catch (err) {
    if (err instanceof ModuleDisabledError) {
      return NextResponse.json(
        { error: "비활성화된 기능입니다." },
        { status: 404 },
      );
    }
    console.error("크레딧 처리 실패");
    return NextResponse.json(
      { error: "크레딧 처리에 실패했습니다" },
      { status: 500 },
    );
  }
}
