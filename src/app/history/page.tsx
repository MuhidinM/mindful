"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { useChild } from "@/store/child-context";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayCells = Array.from({ length: 28 }, (_, index) => index + 1);

export default function HistoryPage() {
  const { activeChild } = useChild();

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Growth Archives
        </p>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Monthly history
        </h2>
      </section>

      <section className="rounded-lg bg-surface-low p-3 shadow-(--shadow-ambient)">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-foreground">September 2023</h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-lowest hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-lowest hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 overflow-hidden rounded-lg bg-surface-high/50">
          {dayLabels.map((day) => (
            <div
              key={day}
              className="bg-surface-low px-2 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {dayCells.map((day) => {
            const isStarDay = day % 5 === 0;
            return (
              <button
                key={day}
                type="button"
                className="h-16 border border-transparent bg-surface-lowest px-2 py-1 text-left transition-colors hover:bg-surface-low"
              >
                <span className="text-xs font-semibold text-foreground">{day}</span>
                {isStarDay ? (
                  <span className="mt-1 block">
                    <Star className={`size-3 fill-current ${activeChild.accentTextClass}`} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg bg-surface-lowest p-5 shadow-(--shadow-ambient)">
        <h3 className="text-sm font-semibold text-foreground">Data management</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          CSV import will be connected in Phase 6 with real parsing and upsert.
        </p>
        <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-low px-4 py-6 text-center">
          <p className="text-sm font-medium text-foreground">Upload old activity CSV</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag file here or choose from your device.
          </p>
          <button
            type="button"
            className={`mt-4 rounded-full px-4 py-2 text-xs font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
          >
            Select File
          </button>
        </div>
      </section>
    </div>
  );
}
