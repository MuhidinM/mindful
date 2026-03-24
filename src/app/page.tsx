"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Wallet } from "lucide-react";

import { redeemFunds } from "@/app/actions/redeem";
import { supabase } from "@/lib/supabase";
import { useChild } from "@/store/child-context";

type ChildRow = {
  id: string;
  name: string;
  color: "Teal" | "Coral";
};

type DailyLogRow = {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  quran: boolean;
  peaceful_day: boolean;
};

type RedemptionRow = {
  amount: number;
  date: string;
};

const TASK_KEYS = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "quran",
  "peaceful_day",
] as const;

export default function HomePage() {
  const { activeChild, selectedChild } = useChild();
  const [childRow, setChildRow] = useState<ChildRow | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLogRow[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    setFeedback("");

    const expectedColor = selectedChild === "child1" ? "Teal" : "Coral";

    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id,name,color")
      .eq("color", expectedColor)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (childError || !child) {
      setChildRow(null);
      setDailyLogs([]);
      setRedemptions([]);
      setIsLoading(false);
      setFeedback("Could not find child profile in database.");
      return;
    }

    setChildRow(child as ChildRow);

    const [logsResponse, redemptionsResponse] = await Promise.all([
      supabase
        .from("daily_logs")
        .select("date,fajr,dhuhr,asr,maghrib,isha,quran,peaceful_day")
        .eq("child_id", child.id),
      supabase
        .from("redemptions")
        .select("amount,date")
        .eq("child_id", child.id),
    ]);

    if (logsResponse.error || redemptionsResponse.error) {
      setDailyLogs([]);
      setRedemptions([]);
      setFeedback("Failed to load dashboard data.");
      setIsLoading(false);
      return;
    }

    setDailyLogs((logsResponse.data ?? []) as DailyLogRow[]);
    setRedemptions((redemptionsResponse.data ?? []) as RedemptionRow[]);
    setIsLoading(false);
  }, [selectedChild]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshDashboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshDashboard]);

  const totalTasks = useMemo(
    () =>
      dailyLogs.reduce((sum, log) => {
        const count = TASK_KEYS.reduce(
          (taskSum, key) => taskSum + (log[key] ? 1 : 0),
          0,
        );
        return sum + count;
      }, 0),
    [dailyLogs],
  );
  const totalEarned = totalTasks * 1.5;
  const redeemed = redemptions.reduce((sum, row) => sum + Number(row.amount), 0);
  const balance = Number((totalEarned - redeemed).toFixed(2));
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLog = dailyLogs.find((log) => log.date === todayKey) ?? null;
  const todayCount = todayLog
    ? TASK_KEYS.reduce((sum, key) => sum + (todayLog[key] ? 1 : 0), 0)
    : 0;
  const progressPercent = Math.round((todayCount / 7) * 100);
  const ringRadius = 50;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - todayCount / 7);

  const recentActivity = useMemo(() => {
    const logByDate = new Map(
      dailyLogs.map((log) => {
        const count = TASK_KEYS.reduce((sum, key) => sum + (log[key] ? 1 : 0), 0);
        return [log.date, count] as const;
      }),
    );
    const today = new Date();
    return [1, 2, 3].map((offsetDays) => {
      const target = new Date(today);
      target.setDate(today.getDate() - offsetDays);
      const dateKey = target.toISOString().slice(0, 10);
      const count = logByDate.get(dateKey) ?? 0;
      const amount = (count * 1.5).toFixed(1);
      const label = offsetDays === 1 ? "Yesterday" : `${offsetDays} Days Ago`;
      return { label, count, amount };
    });
  }, [dailyLogs]);

  const onRedeem = async () => {
    const amount = Number(redeemAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFeedback("Enter a valid amount");
      return;
    }
    if (amount > balance) {
      setFeedback("Amount exceeds current balance");
      return;
    }

    if (!childRow) {
      setFeedback("Child profile is not loaded yet.");
      return;
    }

    setIsRedeeming(true);
    const result = await redeemFunds({ childId: childRow.id, amount });
    setIsRedeeming(false);
    if (!result.ok) {
      setFeedback(result.error ?? "Redeem failed.");
      return;
    }

    setRedeemAmount("");
    setFeedback("Redeemed successfully");
    setShowRedeemModal(false);
    await refreshDashboard();
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Overview
        </p>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Good morning, curator.
        </h2>
        {childRow ? (
          <p className="text-sm text-muted-foreground">{childRow.name}</p>
        ) : null}
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
        <button
          type="button"
          onClick={() => setShowRedeemModal(true)}
          className={`mt-6 h-11 w-full rounded-lg px-4 text-sm font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
        >
          Redeem Funds
        </button>
        {feedback ? <p className="mt-2 text-xs text-muted-foreground">{feedback}</p> : null}
      </section>

      <section className="rounded-lg bg-surface-lowest p-6 text-center shadow-(--shadow-ambient)">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Today&apos;s Progress
        </p>
        <div className="mx-auto mt-5 flex size-40 items-center justify-center rounded-full bg-surface-low">
          <div className="relative flex size-32 items-center justify-center">
            <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-surface-high"
              />
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                className={activeChild.accentTextClass}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-extrabold text-foreground">{todayCount} / 7</p>
              <p className="text-xs text-muted-foreground">{progressPercent}%</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Keep going. You have {7 - todayCount} tasks remaining today.
        </p>
      </section>

      <section className="rounded-lg bg-surface-low p-2">
        <div className="overflow-hidden rounded-lg bg-surface-lowest shadow-(--shadow-ambient)">
          {recentActivity.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-4 even:bg-surface-low/40"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? "Loading..." : `${item.count}/7 tasks`}
                </p>
              </div>
              <p className={`text-sm font-extrabold ${activeChild.accentTextClass}`}>
                +{item.amount} Birr
              </p>
            </div>
          ))}
        </div>
      </section>

      {showRedeemModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-sm rounded-lg bg-surface-lowest p-5 shadow-(--shadow-ambient)">
            <h3 className="font-heading text-xl font-bold text-foreground">Redeem Funds</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Current balance: {balance.toFixed(2)} Birr
            </p>
            <input
              type="number"
              min="0"
              step="0.1"
              value={redeemAmount}
              onChange={(event) => setRedeemAmount(event.target.value)}
              placeholder="Exact amount"
              className="mt-4 h-11 w-full rounded-lg bg-surface-low px-3 text-sm text-foreground ghost-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRedeemModal(false)}
                className="h-10 rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:bg-surface-low"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRedeeming}
                onClick={onRedeem}
                className={`h-10 rounded-lg px-4 text-sm font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
              >
                {isRedeeming ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
