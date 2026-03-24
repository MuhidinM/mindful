import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { ensureWebPushConfigured, webpush } from "@/lib/push";

type PreferenceRow = {
  device_id: string;
  notifications_on: boolean;
  notify_time: string;
  timezone: string;
  last_sent_local_date: string | null;
};

type SubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
  device_id: string;
};

function getLocalTimeParts(timezone: string) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const date = `${pick("year")}-${pick("month")}-${pick("day")}`;
  const hhmm = `${pick("hour")}:${pick("minute")}`;
  return { date, hhmm };
}

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-cron-secret");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (cronSecret && bearer !== cronSecret && cronHeader !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 },
    );
  }
  ensureWebPushConfigured();
  const supabase = createClient(url, key);
  const [{ data: prefData, error: prefError }, { data: subData, error: subError }] =
    await Promise.all([
      supabase
        .from("notification_preferences")
        .select("device_id,notifications_on,notify_time,timezone,last_sent_local_date")
        .eq("notifications_on", true),
      supabase.from("push_subscriptions").select("endpoint,p256dh,auth,device_id"),
    ]);

  if (prefError || subError) {
    return NextResponse.json(
      { error: prefError?.message ?? subError?.message ?? "Load failed" },
      { status: 500 },
    );
  }

  const preferences = (prefData ?? []) as PreferenceRow[];
  const subscriptions = (subData ?? []) as SubscriptionRow[];
  let sent = 0;

  for (const pref of preferences) {
    const { date, hhmm } = getLocalTimeParts(pref.timezone || "UTC");
    if (hhmm !== pref.notify_time || pref.last_sent_local_date === date) continue;

    const targets = subscriptions.filter((row) => row.device_id === pref.device_id);
    const payload = JSON.stringify({
      title: "Mindful Curator",
      body: "Time to log today's activities.",
      icon: "/icon.svg",
      url: "/log",
    });

    for (const target of targets) {
      try {
        await webpush.sendNotification(
          {
            endpoint: target.endpoint,
            keys: {
              p256dh: target.p256dh,
              auth: target.auth,
            },
          },
          payload,
        );
        sent += 1;
      } catch (sendError) {
        const statusCode = (sendError as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", target.endpoint);
        }
      }
    }

    await supabase
      .from("notification_preferences")
      .update({
        last_sent_local_date: date,
        updated_at: new Date().toISOString(),
      })
      .eq("device_id", pref.device_id);
  }

  return NextResponse.json({ ok: true, sent });
}
