import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SubscribeRequest = {
  deviceId: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
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

  const body = (await request.json()) as SubscribeRequest;
  if (!body?.subscription?.endpoint || !body?.deviceId) {
    return NextResponse.json(
      { error: "Invalid subscription payload." },
      { status: 400 },
    );
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: body.subscription.endpoint,
      p256dh: body.subscription.keys.p256dh,
      auth: body.subscription.keys.auth,
      device_id: body.deviceId,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
