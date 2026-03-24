import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { ensureWebPushConfigured, webpush } from "@/lib/push";

type TestRequest = {
  deviceId: string;
};

type SubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as TestRequest;
  if (!body?.deviceId) {
    return NextResponse.json({ error: "Missing deviceId." }, { status: 400 });
  }

  ensureWebPushConfigured();
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint,p256dh,auth")
    .eq("device_id", body.deviceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const subscriptions = (data ?? []) as SubscriptionRow[];
  if (subscriptions.length === 0) {
    return NextResponse.json(
      { error: "No push subscription found for this device." },
      { status: 404 },
    );
  }

  const payload = JSON.stringify({
    title: "Mindful Curator",
    body: "Test notification from settings.",
    icon: "/icon.svg",
    url: "/log",
  });

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        payload,
      );
    } catch (sendError) {
      const statusCode = (sendError as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", subscription.endpoint);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
