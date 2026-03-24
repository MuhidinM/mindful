"use server";

import { createClient } from "@supabase/supabase-js";

type RedeemInput = {
  childId: string;
  amount: number;
};

type RedeemResult = {
  ok: boolean;
  error?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function redeemFunds(input: RedeemInput): Promise<RedeemResult> {
  if (!supabaseUrl || !supabaseKey) {
    return { ok: false, error: "Supabase environment variables are missing." };
  }
  if (!input.childId) {
    return { ok: false, error: "Missing child id." };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from("redemptions").insert({
    child_id: input.childId,
    amount: Number(input.amount.toFixed(2)),
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
