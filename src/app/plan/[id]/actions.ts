"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setDayStatusAction(
  dayId: string,
  status: "watched" | "skipped"
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No autenticado");

  const payload: any = { status };
  if (status === "watched") payload.watched_at = new Date().toISOString();

  const { error: upErr } = await supabase
    .from("plan_days")
    .update(payload)
    .eq("id", dayId);
  if (upErr) throw new Error(upErr.message);

  revalidatePath("/plan");
}

export async function unlockTodayAction(planId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No autenticado");

  const today = new Date().toISOString().slice(0, 10);
  const { error: upErr } = await supabase
    .from("plan_days")
    .update({ status: "unlocked", unlocked_at: new Date().toISOString() })
    .eq("plan_id", planId)
    .lte("day_date", today)
    .eq("status", "locked");
  if (upErr) throw new Error(upErr.message);

  revalidatePath(`/plan/${planId}`);
}
