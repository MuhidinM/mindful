import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type PreferenceRequest = {
  deviceId: string;
  notificationsOn: boolean;
  notifyTime: string;
  timezone: string;
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

  const body = (await request.json()) as PreferenceRequest;
  if (!body?.deviceId || !body?.notifyTime) {
    return NextResponse.json(
      { error: "Invalid preference payload." },
      { status: 400 },
    );
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("notification_preferences").upsert(
    {
      device_id: body.deviceId,
      notifications_on: body.notificationsOn,
      notify_time: body.notifyTime,
      timezone: body.timezone || "UTC",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "device_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
