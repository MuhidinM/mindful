"use client";

import { useState } from "react";
import { BellRing, Link2, RefreshCcw, Save, ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { useChild } from "@/store/child-context";

export default function SettingsPage() {
  const { activeChild } = useChild();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [notifyTime, setNotifyTime] = useState("20:00");
  const [message, setMessage] = useState("");

  const saveReminder = async () => {
    setMessage("");
    if (notificationsOn && "Notification" in window) {
      await Notification.requestPermission();
    }
    window.localStorage.setItem(
      `mindful.reminder.${activeChild.key}`,
      JSON.stringify({ notificationsOn, notifyTime }),
    );
    setMessage("Reminder settings saved");
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
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                notificationsOn ? "translate-x-6" : "translate-x-1"
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
