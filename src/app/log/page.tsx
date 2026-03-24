"use client";

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
      <section className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Daily Log
        </p>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Track today
        </h2>
      </section>

      <section className="rounded-lg bg-surface-lowest p-5 shadow-(--shadow-ambient)">
        <p className={`text-sm font-semibold ${activeChild.accentTextClass}`}>
          {activeChild.label} task checklist
        </p>
        <ul className="mt-4 space-y-3">
          {taskNames.map((task) => (
            <li
              key={task}
              className="flex items-center justify-between rounded-lg bg-surface-low px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground">{task}</span>
              <span className="size-5 rounded-full bg-surface-high" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
