"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addDays, eachDayOfInterval, isWeekend } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CreatePlanInput = {
  name?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  count: number;
  strategy?: "daily" | "weekends" | "3_per_week" | "custom";
  allowedMovieIds?: string[];
  customDays?: string[]; // YYYY-MM-DD[]
};

function pickDays(range: string[], count: number) {
  if (count >= range.length) return range;
  const step = Math.floor(range.length / count);
  const out: string[] = [];
  let idx = 0;
  for (let i = 0; i < count; i++) {
    out.push(range[Math.min(idx, range.length - 1)]);
    idx += step;
  }
  return out;
}

export async function createPlanAction(input: CreatePlanInput) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("No autenticado");

  const {
    name,
    startDate,
    endDate,
    count,
    strategy = "daily",
    allowedMovieIds = [],
    customDays = [],
  } = input;

  // 1) Pool de películas
  let moviePool: { id: string }[] = [];
  if (allowedMovieIds.length > 0) {
    moviePool = allowedMovieIds.map((id) => ({ id }));
  } else {
    const { data: uc } = await supabase
      .from("user_catalog")
      .select("movie_id")
      .eq("user_id", user.id)
      .eq("allowed", true);
    if (uc && uc.length > 0) {
      moviePool = uc.map((r) => ({ id: r.movie_id as string }));
    } else {
      const { data: m } = await supabase.from("movies").select("id");
      moviePool = (m ?? []).map((r) => ({ id: r.id as string }));
    }
  }
  if (moviePool.length === 0)
    throw new Error("No hay películas en el catálogo");

  // 2) Días según estrategia
  const dates = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  }).map((d) => d.toISOString().slice(0, 10));

  let days: string[] = [];
  switch (strategy) {
    case "daily":
      days = dates;
      break;
    case "weekends":
      days = dates.filter((d) => isWeekend(new Date(d)));
      break;
    case "3_per_week":
      days = pickDays(dates, Math.min(count, Math.ceil(dates.length / 2)));
      break;
    case "custom":
      days = customDays.length ? [...customDays].sort() : [];
      break;
    default:
      days = dates;
  }

  if (count > 0) {
    if (days.length > count) days = pickDays(days, count);
    if (days.length < count) {
      let cursor = new Date(endDate);
      while (days.length < count) {
        cursor = addDays(cursor, 1);
        days.push(cursor.toISOString().slice(0, 10));
      }
    }
  }

  // 3) Shuffle asignación
  for (let i = moviePool.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [moviePool[i], moviePool[j]] = [moviePool[j], moviePool[i]];
  }
  const chosen = moviePool.slice(0, days.length);

  // 4) Inserta plan y días
  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .insert({
      user_id: user.id,
      name: name ?? "Mi plan de Halloween",
      start_date: startDate,
      end_date: endDate,
      cadence: strategy,
    })
    .select()
    .single();
  if (planErr || !plan)
    throw new Error(planErr?.message ?? "Error creando plan");

  const rows = days.map((d, idx) => ({
    plan_id: plan.id,
    day_date: d,
    movie_id: chosen[idx].id,
    status: "locked" as const,
  }));

  if (rows.length > 0) {
    const { error: pdErr } = await supabase.from("plan_days").insert(rows);
    if (pdErr) throw new Error(pdErr.message);
  }

  revalidatePath(`/plan/${plan.id}`);
  redirect(`/plan/${plan.id}`);
}
