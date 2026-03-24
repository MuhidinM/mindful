"use client";

import { useMemo, useState } from "react";
import { BellRing, Link2, RefreshCcw, Save, ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { useChild } from "@/store/child-context";

export default function SettingsPage() {
  const { activeChild } = useChild();
  const initialSaved =
    typeof window === "undefined"
      ? null
      : (() => {
          try {
            const raw = window.localStorage.getItem(
              `mindful.reminder.${activeChild.key}`,
            );
            if (!raw) return null;
            return JSON.parse(raw) as {
              notificationsOn?: boolean;
              notifyTime?: string;
            };
          } catch {
            return null;
          }
        })();
  const [notificationsOn, setNotificationsOn] = useState(
    initialSaved?.notificationsOn ?? true,
  );
  const [notifyTime, setNotifyTime] = useState(initialSaved?.notifyTime ?? "20:00");
  const [message, setMessage] = useState("");
  const permissionState: "unsupported" | "default" | "granted" | "denied" =
    typeof window === "undefined"
      ? "default"
      : "Notification" in window
        ? Notification.permission
        : "unsupported";
  const [nextReminder, setNextReminder] = useState<string>("");

  const storageKey = useMemo(
    () => `mindful.reminder.${activeChild.key}`,
    [activeChild.key],
  );

  const computeNextReminder = (timeValue: string) => {
    const [hoursRaw, minutesRaw] = timeValue.split(":");
    const hours = Number(hoursRaw);
    const minutes = Number(minutesRaw);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "";
    const now = new Date();
    const candidate = new Date();
    candidate.setHours(hours, minutes, 0, 0);
    if (candidate.getTime() <= now.getTime()) {
      candidate.setDate(candidate.getDate() + 1);
    }
    return candidate.toLocaleString();
  };

  const saveReminder = async () => {
    setMessage("");
    if (notificationsOn && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Notification permission was not granted.");
      }
    }
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ notificationsOn, notifyTime }),
    );
    const next = notificationsOn ? computeNextReminder(notifyTime) : "";
    setNextReminder(next);
    setMessage("Reminder settings saved");
  };

  const sendTestReminder = () => {
    window.dispatchEvent(new Event("mindful:reminder-test"));

    if (!("Notification" in window)) {
      setMessage("In-app reminder shown. Browser notifications unsupported.");
      return;
    }
    if (Notification.permission !== "granted") {
      setMessage("In-app reminder shown. Enable browser notifications for system popups.");
      return;
    }
    new Notification("Mindful Curator", {
      body: "Time to log today's activities.",
      icon: "/icon.svg",
    });
    setMessage("In-app reminder shown and browser notification sent.");
  };

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Curation &amp; Flow
        </p>
        <h2 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Settings &amp; Reminders
        </h2>
      </section>

      <section className="rounded-lg bg-surface-lowest p-6 shadow-(--shadow-ambient)">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Daily Notifications</h3>
            <p className="text-sm text-muted-foreground">Keep logs consistent</p>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsOn((prev) => !prev)}
            aria-pressed={notificationsOn}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              notificationsOn ? activeChild.accentGradientClass : "bg-surface-high"
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                notificationsOn ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="rounded-lg bg-surface-low p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BellRing className={`size-4 ${activeChild.accentTextClass}`} />
            Notification Time
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="time"
              value={notifyTime}
              onChange={(event) => setNotifyTime(event.target.value)}
              className="h-11 flex-1 rounded-lg bg-surface-lowest px-3 text-lg font-bold text-foreground ghost-border focus:outline-none"
            />
            <button
              type="button"
              onClick={saveReminder}
              className={`h-11 rounded-lg px-4 text-sm font-bold text-primary-foreground ${activeChild.accentGradientClass}`}
            >
              <span className="inline-flex items-center gap-1">
                <Save className="size-4" />
                Save
              </span>
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Browser permission: <span className="font-semibold">{permissionState}</span>
            </p>
            <button
              type="button"
              onClick={sendTestReminder}
              className="rounded-full px-3 py-1 text-xs font-semibold text-foreground hover:bg-surface-high"
            >
              Send Test
            </button>
          </div>
          {nextReminder ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Next reminder: {nextReminder}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            Works while app is open. For reminders when app is closed, use Web Push.
          </p>
          {message ? <p className="mt-2 text-xs text-muted-foreground">{message}</p> : null}
        </div>
      </section>

      <section className="rounded-lg bg-surface-lowest p-6 shadow-(--shadow-ambient)">
        <h3 className="text-lg font-bold text-foreground">Account Sync</h3>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-surface-low px-3 py-2">
            <span className="inline-flex items-center gap-2 text-sm text-foreground">
              <RefreshCcw className="size-4 text-emerald-600" />
              Logged in as Admin
            </span>
            <ShieldCheck className="size-4 text-emerald-600" />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-surface-low px-3 py-2">
            <span className="inline-flex items-center gap-2 text-sm text-foreground">
              <Link2 className={`size-4 ${activeChild.accentTextClass}`} />
              Synced with Parent 2
            </span>
          </div>
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
