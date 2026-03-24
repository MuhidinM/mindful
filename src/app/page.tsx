"use client";

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
        <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
        <p className={`mt-2 text-4xl font-extrabold ${activeChild.accentTextClass}`}>
          0.00 Birr
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Phase 4 will connect this to Supabase calculations.
        </p>
        <button
          type="button"
          className={`mt-6 w-full rounded-lg py-3 text-sm font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
        >
          Redeem Funds
        </button>
      </section>

      <section className="rounded-lg bg-surface-lowest p-6 shadow-(--shadow-ambient)">
        <p className="text-sm font-medium text-muted-foreground">
          Today&apos;s Progress
        </p>
        <p className="mt-2 text-2xl font-extrabold text-foreground">0 / 7 Tasks Done</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Live task completion arrives in Phase 5.
        </p>
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
