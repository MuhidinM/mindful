export const TASK_KEYS = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "quran",
  "peaceful_day",
] as const;

export type TaskKey = (typeof TASK_KEYS)[number];

export type DailyLog = {
  child: "child1" | "child2";
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  quran: boolean;
  peaceful_day: boolean;
};

export type Redemption = {
  child: "child1" | "child2";
  amount: number;
  createdAt: string;
};

const LOGS_KEY = "mindful.logs.v1";
const REDEMPTIONS_KEY = "mindful.redemptions.v1";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDateHeading(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getAllLogs(): DailyLog[] {
  if (typeof window === "undefined") return [];
  return safeParse<DailyLog[]>(window.localStorage.getItem(LOGS_KEY), []);
}

export function getLog(child: "child1" | "child2", date: string): DailyLog | null {
  const logs = getAllLogs();
  return logs.find((entry) => entry.child === child && entry.date === date) ?? null;
}

export function upsertLog(entry: DailyLog) {
  if (typeof window === "undefined") return;
  const logs = getAllLogs();
  const index = logs.findIndex(
    (item) => item.child === entry.child && item.date === entry.date,
  );
  if (index >= 0) logs[index] = entry;
  else logs.push(entry);
  window.localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function bulkUpsertLogs(entries: DailyLog[]) {
  if (typeof window === "undefined") return;
  const logs = getAllLogs();
  for (const entry of entries) {
    const index = logs.findIndex(
      (item) => item.child === entry.child && item.date === entry.date,
    );
    if (index >= 0) logs[index] = entry;
    else logs.push(entry);
  }
  window.localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function getRedemptions(child: "child1" | "child2"): Redemption[] {
  if (typeof window === "undefined") return [];
  const all = safeParse<Redemption[]>(window.localStorage.getItem(REDEMPTIONS_KEY), []);
  return all.filter((item) => item.child === child);
}

export function addRedemption(entry: Redemption) {
  if (typeof window === "undefined") return;
  const all = safeParse<Redemption[]>(window.localStorage.getItem(REDEMPTIONS_KEY), []);
  all.push(entry);
  window.localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify(all));
}

export function getTaskCount(log: DailyLog | null) {
  if (!log) return 0;
  return TASK_KEYS.reduce((count, key) => count + (log[key] ? 1 : 0), 0);
}

export function createEmptyLog(
  child: "child1" | "child2",
  date: string,
): DailyLog {
  return {
    child,
    date,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    quran: false,
    peaceful_day: false,
  };
}
