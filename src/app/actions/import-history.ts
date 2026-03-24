"use server";

import { createClient } from "@supabase/supabase-js";

type ImportLogInput = {
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

type ImportResult = {
  ok: boolean;
  count?: number;
  error?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function importHistoryLogs(
  rows: ImportLogInput[],
): Promise<ImportResult> {
  if (!supabaseUrl || !supabaseKey) {
    return { ok: false, error: "Supabase environment variables are missing." };
  }
  if (rows.length === 0) {
    return { ok: false, error: "No rows to import." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from("daily_logs").upsert(rows, {
    onConflict: "child_id,date",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, count: rows.length };
}
