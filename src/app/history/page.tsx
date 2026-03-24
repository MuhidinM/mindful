"use client";

import { useChild } from "@/store/child-context";

const historyRows = [
  { label: "Yesterday", amount: "0.0 Birr" },
  { label: "2 Days Ago", amount: "0.0 Birr" },
  { label: "3 Days Ago", amount: "0.0 Birr" },
];

export default function HistoryPage() {
  const { activeChild } = useChild();

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          History
        </p>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Recent activity
        </h2>
      </section>

      <section className="rounded-lg bg-surface-low p-2">
        <div className="overflow-hidden rounded-lg bg-surface-lowest shadow-(--shadow-ambient)">
          {historyRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-5 py-4 even:bg-surface-low/40"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{row.label}</p>
                <p className="text-xs text-muted-foreground">Data will load from DB</p>
              </div>
              <p className={`text-sm font-extrabold ${activeChild.accentTextClass}`}>
                {row.amount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
