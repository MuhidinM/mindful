"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useChild } from "@/store/child-context";

const taskNames = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
  "Reading Quran",
  "Peaceful Day",
];

export default function LogPage() {
  const { activeChild } = useChild();

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <button
          type="button"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Today&apos;s Progress
          </p>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Track Today
          </h2>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
        >
          <ChevronRight className="size-5" />
        </button>
      </section>

      <section className="rounded-lg bg-surface-lowest p-4 shadow-(--shadow-ambient)">
        <p className={`text-sm font-semibold ${activeChild.accentTextClass}`}>
          {activeChild.label} task checklist
        </p>
        <ul className="mt-4 overflow-hidden rounded-lg">
          {taskNames.map((task) => (
            <li
              key={task}
              className="flex items-center justify-between bg-surface-low px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span className={`h-5 w-1.5 rounded-full ${activeChild.accentGradientClass}`} />
                <span className="text-sm font-semibold text-foreground">{task}</span>
              </div>
              <span className="h-7 w-12 rounded-full bg-surface-high" />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-between rounded-full bg-surface-low px-5 py-3 ghost-border">
        <p className="text-sm text-muted-foreground">
          Today&apos;s Earnings:{" "}
          <span className={`font-extrabold ${activeChild.accentTextClass}`}>0.0</span>{" "}
          Birr
        </p>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-xs font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
        >
          Save Log
        </button>
      </section>
    </div>
  );
}
