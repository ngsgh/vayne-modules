"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCredits } from "@/hooks/use-credits";

const PRESET_AMOUNTS = [100, 500, 1000, 5000] as const;

export function RechargeDialog() {
  const [open, setOpen] = useState(false);
  const { recharge } = useCredits();

  async function handleRecharge(amount: number) {
    await recharge(amount);
    setOpen(false);
    toast.success(`${amount.toLocaleString()} 크레딧이 충전되었습니다`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>충전</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>크레딧 충전</DialogTitle>
          <DialogDescription>
            충전할 크레딧 금액을 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          {PRESET_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="h-16 text-lg font-semibold"
              onClick={() => handleRecharge(amount)}
            >
              {amount.toLocaleString()}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
