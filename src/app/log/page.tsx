"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useChild } from "@/store/child-context";

type TaskKey =
  | "fajr"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "quran"
  | "peaceful_day";

type DailyLogDraft = {
  child_id: string;
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  quran: boolean;
  peaceful_day: boolean;
};

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateHeading(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

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
  const [draft, setDraft] = useState<DailyLogDraft | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    let isActive = true;

    const hydrate = async () => {
      setMessage("Loading...");
      const expectedColor = child === "child1" ? "Teal" : "Coral";
      const { data: childRow, error: childError } = await supabase
        .from("children")
        .select("id,color")
        .eq("color", expectedColor)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!isActive) return;
      if (childError || !childRow) {
        setDraft(null);
        setChildId(null);
        setMessage("Child profile missing.");
        return;
      }

      const resolvedChildId = childRow.id as string;
      setChildId(resolvedChildId);

      const { data: logRow, error: logError } = await supabase
        .from("daily_logs")
        .select("child_id,date,fajr,dhuhr,asr,maghrib,isha,quran,peaceful_day")
        .eq("child_id", resolvedChildId)
        .eq("date", dateKey)
        .maybeSingle();

      if (!isActive) return;
      if (logError) {
        setMessage("Unable to load daily log.");
        return;
      }

      setDraft(
        (logRow as DailyLogDraft | null) ?? {
          child_id: resolvedChildId,
          date: dateKey,
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false,
          quran: false,
          peaceful_day: false,
        },
      );
      setMessage("");
    };

    void hydrate();

    return () => {
      isActive = false;
    };
  }, [child, dateKey]);

  useEffect(() => {
    if (!childId) return;
    const channel = supabase
      .channel(`daily_logs_${childId}_${dateKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_logs",
          filter: `child_id=eq.${childId}`,
        },
        (payload) => {
          const record = (payload.new ?? payload.old) as
            | (DailyLogDraft & { id?: string })
            | undefined;
          if (!record || record.date !== dateKey) return;
          if (payload.eventType === "DELETE") {
            setDraft((prev) =>
              prev
                ? {
                    ...prev,
                    fajr: false,
                    dhuhr: false,
                    asr: false,
                    maghrib: false,
                    isha: false,
                    quran: false,
                    peaceful_day: false,
                  }
                : prev,
            );
            return;
          }
          setDraft((prev) =>
            prev
              ? {
                  ...prev,
                  fajr: record.fajr,
                  dhuhr: record.dhuhr,
                  asr: record.asr,
                  maghrib: record.maghrib,
                  isha: record.isha,
                  quran: record.quran,
                  peaceful_day: record.peaceful_day,
                }
              : prev,
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [childId, dateKey]);

  const persistDraft = async (next: DailyLogDraft) => {
    const { error } = await supabase.from("daily_logs").upsert(next, {
      onConflict: "child_id,date",
    });
    if (error) {
      setMessage("Sync failed. Try again.");
      return false;
    }
    setMessage("Synced");
    window.setTimeout(() => setMessage(""), 1200);
    return true;
  };

  const toggleTask = async (key: TaskKey) => {
    if (!draft) return;
    const previous = draft[key];
    const next = { ...draft, [key]: !previous };
    setDraft(next);
    const ok = await persistDraft(next);
    if (!ok) {
      setDraft({ ...next, [key]: previous });
    }
  };

  const onSave = async () => {
    if (!draft) return;
    await persistDraft(draft);
  };

  const taskCount = draft
    ? (taskRows.reduce((sum, task) => sum + (draft[task.key] ? 1 : 0), 0) as number)
    : 0;
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
                disabled={!draft}
                aria-pressed={Boolean(draft?.[task.key])}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  draft?.[task.key] ? activeChild.accentGradientClass : "bg-surface-high"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                    draft?.[task.key] ? "translate-x-6" : "translate-x-1"
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
          disabled={!draft}
          className={`rounded-full px-4 py-2 text-xs font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
        >
          {message || "Save Log"}
        </button>
      </section>
    </>
  );
}
