"use client";

import { Wallet } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { useChild } from "@/store/child-context";

export default function HomePage() {
  const { activeChild } = useChild();

  return (
    <div className="space-y-6">
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
              0.00 Birr
            </p>
          </div>
          <span className="rounded-xl bg-surface-low p-3">
            <Wallet className={`size-5 ${activeChild.accentTextClass}`} />
          </span>
        </div>
        <button
          type="button"
          className={`mt-6 w-full rounded-lg py-3 text-sm font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
        >
          Redeem Funds
        </button>
      </section>

      <section className="rounded-lg bg-surface-lowest p-6 text-center shadow-(--shadow-ambient)">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Today&apos;s Progress
        </p>
        <div className="mx-auto mt-5 flex size-40 items-center justify-center rounded-full bg-surface-low">
          <div className="flex size-32 items-center justify-center rounded-full border-10 border-surface-high">
            <div>
              <p className="text-3xl font-extrabold text-foreground">0 / 7</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Keep going. You have 7 tasks available today.
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

      <section className="rounded-lg bg-surface-lowest p-6 shadow-(--shadow-ambient)">
        <p className="text-sm font-medium text-muted-foreground">Session</p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </section>
    </div>
  );
}
