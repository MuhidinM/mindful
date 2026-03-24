"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useChild } from "@/store/child-context";
import {
  createEmptyLog,
  formatDateHeading,
  getLog,
  getTaskCount,
  TaskKey,
  toDateKey,
  upsertLog,
} from "@/lib/local-data";

const taskRows: { key: TaskKey; label: string }[] = [
  { key: "fajr", label: "Fajr" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
  { key: "quran", label: "Reading Quran" },
  { key: "peaceful_day", label: "Peaceful Day" },
];

export default function LogPage() {
  const { selectedChild } = useChild();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const shiftDay = (delta: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + delta);
      return next;
    });
  };

  const editorKey = `${selectedChild}:${dateKey}`;

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftDay(-1)}
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
          onClick={() => shiftDay(1)}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
        >
          <ChevronRight className="size-5" />
        </button>
      </section>
      <p className="text-center text-sm font-semibold text-foreground">
        {formatDateHeading(selectedDate)}
      </p>
      <LogEditor key={editorKey} child={selectedChild} dateKey={dateKey} />
    </div>
  );
}

function LogEditor({
  child,
  dateKey,
}: {
  child: "child1" | "child2";
  dateKey: string;
}) {
  const { activeChild } = useChild();
  const [saveMessage, setSaveMessage] = useState("");
  const [draft, setDraft] = useState(() => {
    const existing = getLog(child, dateKey);
    return existing ?? createEmptyLog(child, dateKey);
  });

  const toggleTask = (key: TaskKey) => {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSave = () => {
    upsertLog(draft);
    setSaveMessage("Saved");
    window.setTimeout(() => setSaveMessage(""), 1200);
  };

  const taskCount = getTaskCount(draft);
  const earnings = (taskCount * 1.5).toFixed(1);

  return (
    <>
      <section className="rounded-lg bg-surface-lowest p-4 shadow-(--shadow-ambient)">
        <p className={`text-sm font-semibold ${activeChild.accentTextClass}`}>
          {activeChild.label} task checklist
        </p>
        <ul className="mt-4 overflow-hidden rounded-lg">
          {taskRows.map((task) => (
            <li
              key={task.key}
              className="flex items-center justify-between bg-surface-low px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span className={`h-5 w-1.5 rounded-full ${activeChild.accentGradientClass}`} />
                <span className="text-sm font-semibold text-foreground">{task.label}</span>
              </div>
              <button
                type="button"
                onClick={() => toggleTask(task.key)}
                aria-pressed={draft[task.key]}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  draft[task.key] ? activeChild.accentGradientClass : "bg-surface-high"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                    draft[task.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-between rounded-full bg-surface-low px-5 py-3 ghost-border">
        <p className="text-sm text-muted-foreground">
          Today&apos;s Earnings:{" "}
          <span className={`font-extrabold ${activeChild.accentTextClass}`}>{earnings}</span>{" "}
          Birr
        </p>
        <button
          type="button"
          onClick={onSave}
          className={`rounded-full px-4 py-2 text-xs font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
        >
          {saveMessage || "Save Log"}
        </button>
      </section>
    </>
  );
}
