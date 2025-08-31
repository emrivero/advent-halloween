"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEffectiveToday } from "@/lib/time";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function unlockTodayAction(planId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Hoy como YYYY-MM-DD en Europe/Madrid (tu función ya lo da así)
  const today = await getEffectiveToday();

  // Desbloquear todo <= hoy que siga locked y no esté visto
  const { error } = await supabase
    .from("plan_days")
    .update({ status: "unlocked" })
    .lte("day_date", today) // day_date es DATE
    .is("watched_at", null)
    .eq("status", "locked")
    .eq("plan_id", planId);

  if (error) throw new Error(error.message);

  // Revalidar la página del plan
  revalidatePath(`/plan/${planId}`, "page");
}

export async function setDayStatusAction(
  dayId: string,
  status: "watched" | "skipped" | "unlocked" | "locked",
  planId?: string
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const patch: any = { status };
  if (status === "watched") patch.watched_at = new Date().toISOString();
  if (status !== "watched") patch.watched_at = null;

  const { error } = await supabase
    .from("plan_days")
    .update(patch)
    .eq("id", dayId);

  if (error) throw new Error(error.message);

  if (planId) revalidatePath(`/plan/${planId}`, "page");
}

export async function deletePlanAction(formData: FormData) {
  const planId = formData.get("planId") as string;
  if (!planId) throw new Error("Falta planId");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .select("id, user_id")
    .eq("id", planId)
    .single();

  if (planErr || !plan || plan.user_id !== user.id) {
    throw new Error("No tienes permiso para borrar este plan");
  }

  // Si NO tienes ON DELETE CASCADE, borra días primero
  await supabase.from("plan_days").delete().eq("plan_id", planId);

  const { error: delErr } = await supabase
    .from("plans")
    .delete()
    .eq("id", planId);
  if (delErr) throw delErr;

  revalidatePath("/plan");
  redirect("/plan/setup");
}
