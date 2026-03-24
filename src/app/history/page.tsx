"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Papa from "papaparse";

import { useChild } from "@/store/child-context";
import {
  bulkUpsertLogs,
  DailyLog,
  getAllLogs,
  getTaskCount,
  TASK_KEYS,
  TaskKey,
} from "@/lib/local-data";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HistoryPage() {
  const { activeChild } = useChild();
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const monthTitle = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(monthCursor);

  const calendarCells = useMemo(() => {
    const startWeekday = (monthCursor.getDay() + 6) % 7;
    const daysInMonth = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + 1,
      0,
    ).getDate();

    return Array.from({ length: startWeekday + daysInMonth }, (_, index) => {
      if (index < startWeekday) return null;
      return index - startWeekday + 1;
    });
  }, [monthCursor]);

  const childLogs = getAllLogs().filter((entry) => entry.child === activeChild.key);

  const shiftMonth = (delta: number) => {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const getLogForDay = (day: number) => {
    const key = `${monthCursor.getFullYear()}-${String(monthCursor.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;
    return childLogs.find((entry) => entry.date === key) ?? null;
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed: DailyLog[] = result.data
          .map((row) => {
            const date = row.Date?.trim();
            if (!date) return null;

            const getBool = (key: string) => row[key]?.trim() === "1";
            const entry: DailyLog = {
              child: activeChild.key,
              date,
              fajr: getBool("Fajr"),
              dhuhr: getBool("Dhuhr"),
              asr: getBool("Asr"),
              maghrib: getBool("Maghrib"),
              isha: getBool("Isha"),
              quran: getBool("Quran"),
              peaceful_day: getBool("PeacefulDay"),
            };
            return entry;
          })
          .filter((entry): entry is DailyLog => Boolean(entry));

        bulkUpsertLogs(parsed);
        setUploadMessage(`Imported ${parsed.length} rows`);
      },
      error: () => {
        setUploadMessage("Import failed");
      },
    });
  };

  const selectedLog =
    selectedDate === null
      ? null
      : childLogs.find(
          (entry) => entry.date === selectedDate.toISOString().slice(0, 10),
        ) ?? null;

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
          <h3 className="font-heading text-xl font-bold text-foreground">{monthTitle}</h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-lowest hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
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
          {calendarCells.map((day, index) => {
            if (day === null) {
              return (
                <div key={`blank-${index}`} className="h-16 bg-surface-lowest/50" />
              );
            }
            const log = getLogForDay(day);
            const count = getTaskCount(log);
            const isStarDay = count === TASK_KEYS.length;
            return (
              <button
                key={day}
                type="button"
                onClick={() =>
                  setSelectedDate(
                    new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day),
                  )
                }
                className="h-16 border border-transparent bg-surface-lowest px-2 py-1 text-left transition-colors hover:bg-surface-low"
              >
                <span className="text-xs font-semibold text-foreground">{day}</span>
                {isStarDay ? (
                  <span className="mt-1 block">
                    <Star className={`size-3 fill-current ${activeChild.accentTextClass}`} />
                  </span>
                ) : count > 0 ? (
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {count}/7
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onUploadFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={onPickFile}
            className={`mt-4 rounded-full px-4 py-2 text-xs font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
          >
            Select File
          </button>
          {uploadMessage ? (
            <p className="mt-2 text-xs text-muted-foreground">{uploadMessage}</p>
          ) : null}
        </div>
      </section>

      {selectedDate ? (
        <section className="rounded-lg bg-surface-lowest p-5 shadow-(--shadow-ambient)">
          <h3 className="text-sm font-semibold text-foreground">
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
          <div className="mt-3 space-y-2">
            {selectedLog ? (
              TASK_KEYS.map((key) => {
                const labelMap: Record<TaskKey, string> = {
                  fajr: "Fajr",
                  dhuhr: "Dhuhr",
                  asr: "Asr",
                  maghrib: "Maghrib",
                  isha: "Isha",
                  quran: "Reading Quran",
                  peaceful_day: "Peaceful Day",
                };
                const done = selectedLog[key];
                return (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{labelMap[key]}</span>
                    <span className={done ? activeChild.accentTextClass : "text-muted-foreground"}>
                      {done ? "Done" : "Missed"}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No log saved for this day.</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
