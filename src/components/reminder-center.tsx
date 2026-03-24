"use client";

import { useEffect, useMemo, useState } from "react";

import { useChild } from "@/store/child-context";

type ReminderConfig = {
  notificationsOn?: boolean;
  notifyTime?: string;
};

export function ReminderCenter() {
  const { activeChild } = useChild();
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("Time to log today's activities.");

  const storageKey = useMemo(
    () => `mindful.reminder.${activeChild.key}`,
    [activeChild.key],
  );

  useEffect(() => {
    const onTest = () => {
      setMessage("Test reminder: please complete today's checklist.");
      setIsVisible(true);
    };
    window.addEventListener("mindful:reminder-test", onTest);
    return () => window.removeEventListener("mindful:reminder-test", onTest);
  }, []);

  useEffect(() => {
    const checkReminder = () => {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      let config: ReminderConfig | null = null;
      try {
        config = JSON.parse(raw) as ReminderConfig;
      } catch {
        return;
      }
      if (!config?.notificationsOn || !config.notifyTime) return;

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const minuteKey = `${now.toISOString().slice(0, 10)}-${config.notifyTime}-${activeChild.key}`;
      const lastTriggered = window.localStorage.getItem("mindful.reminder.last");
      if (`${hh}:${mm}` !== config.notifyTime || lastTriggered === minuteKey) return;

      window.localStorage.setItem("mindful.reminder.last", minuteKey);
      setMessage(`Reminder for ${activeChild.label}: log today's tasks.`);
      setIsVisible(true);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Mindful Curator", {
          body: `Reminder for ${activeChild.label}: log today's tasks.`,
          icon: "/icon.svg",
        });
      }
    };

    checkReminder();
    const id = window.setInterval(checkReminder, 30000);
    return () => window.clearInterval(id);
  }, [activeChild.key, activeChild.label, storageKey]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-40 mx-auto w-full max-w-md px-4">
      <div className="rounded-lg bg-surface-lowest p-3 shadow-(--shadow-ambient) ghost-border">
        <p className="text-sm font-semibold text-foreground">{message}</p>
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="rounded-lg px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-surface-low"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
