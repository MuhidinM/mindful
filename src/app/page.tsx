"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

import {
  addRedemption,
  getAllLogs,
  getRedemptions,
  getTaskCount,
} from "@/lib/local-data";
import { useChild } from "@/store/child-context";

export default function HomePage() {
  const { activeChild, selectedChild } = useChild();
  const [redeemAmount, setRedeemAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [revision, setRevision] = useState(0);
  const childLogs = getAllLogs()
    .filter((log) => log.child === selectedChild)
    .slice();
  const totalTasks = childLogs.reduce((sum, log) => sum + getTaskCount(log), 0);
  const totalEarned = totalTasks * 1.5;
  const redeemed = getRedemptions(selectedChild).reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const balance = Number((totalEarned - redeemed).toFixed(2));
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLog = childLogs.find((log) => log.date === todayKey) ?? null;
  const todayCount = getTaskCount(todayLog);

  const onRedeem = () => {
    const amount = Number(redeemAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeedback("Enter a valid amount");
      return;
    }
    if (amount > balance) {
      setFeedback("Amount exceeds current balance");
      return;
    }
    addRedemption({
      child: selectedChild,
      amount: Number(amount.toFixed(2)),
      createdAt: new Date().toISOString(),
    });
    setRedeemAmount("");
    setFeedback("Redeemed successfully");
    setRevision((prev) => prev + 1);
  };

  return (
    <div className="space-y-6" data-revision={revision}>
      <section className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Overview
        </p>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Good morning, curator.
        </h2>
      </section>

      <section className="rounded-lg bg-surface-lowest p-6 shadow-(--shadow-ambient)">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
            <p className={`mt-2 text-5xl font-extrabold ${activeChild.accentTextClass}`}>
              {balance.toFixed(2)} Birr
            </p>
          </div>
          <span className="rounded-xl bg-surface-low p-3">
            <Wallet className={`size-5 ${activeChild.accentTextClass}`} />
          </span>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.1"
              value={redeemAmount}
              onChange={(event) => setRedeemAmount(event.target.value)}
              placeholder="Amount to redeem"
              className="h-11 flex-1 rounded-lg bg-surface-low px-3 text-sm text-foreground ghost-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={onRedeem}
              className={`h-11 rounded-lg px-4 text-sm font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
            >
              Redeem
            </button>
          </div>
          {feedback ? <p className="text-xs text-muted-foreground">{feedback}</p> : null}
        </div>
      </section>

      <section className="rounded-lg bg-surface-lowest p-6 text-center shadow-(--shadow-ambient)">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Today&apos;s Progress
        </p>
        <div className="mx-auto mt-5 flex size-40 items-center justify-center rounded-full bg-surface-low">
          <div className="flex size-32 items-center justify-center rounded-full border-10 border-surface-high">
            <div>
              <p className="text-3xl font-extrabold text-foreground">{todayCount} / 7</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Keep going. You have {7 - todayCount} tasks remaining today.
        </p>
      </section>

      <section className="rounded-lg bg-surface-low p-2">
        <div className="overflow-hidden rounded-lg bg-surface-lowest shadow-(--shadow-ambient)">
          {["Yesterday", "2 Days Ago", "3 Days Ago"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between px-5 py-4 even:bg-surface-low/40"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">No synced logs yet</p>
              </div>
              <p className={`text-sm font-extrabold ${activeChild.accentTextClass}`}>
                +0.0 Birr
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
