"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type SelectedMovie = {
  id?: string; // si ya existe en DB
  title: string;
  poster_url?: string | null;
  tags?: string[]; // opcional: ["Spooky"], ["Sobrenatural"], ["Slasher"]
  isCustom?: boolean; // si viene del buscador custom
};

export async function createPlanFromSelectionAction(input: {
  name: string;
  days: string[]; // YYYY-MM-DD ordenados
  movies: SelectedMovie[]; // misma longitud que days
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("No autenticado");

  const { name, days, movies } = input;
  if (!days.length) throw new Error("Sin días");
  if (movies.length !== days.length)
    throw new Error("El nº de películas debe igualar el nº de días");

  // 1) Inserta/asegura custom movies que no tengan id
  const toInsert = movies
    .map((m, idx) => ({ ...m, _idx: idx }))
    .filter((m) => !m.id)
    .map((m) => ({
      title: m.title,
      poster_url: m.poster_url ?? null,
      tags: m.tags ?? null,
    }));

  let insertedIds: string[] = [];
  if (toInsert.length) {
    const { data: inserted, error: insErr } = await supabase
      .from("movies")
      .insert(toInsert)
      .select("id")
      .returns<{ id: string }[]>();
    if (insErr) throw new Error(insErr.message);
    insertedIds = inserted.map((x) => x.id);
  }

  // 2) Construye array final de ids manteniendo orden de selección
  let idxInserted = 0;
  const movieIds = movies.map((m) => {
    if (m.id) return m.id;
    const id = insertedIds[idxInserted];
    idxInserted += 1;
    return id;
  });

  // 3) Crea plan
  const start = days[0],
    end = days[days.length - 1];
  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .insert({
      user_id: user.id,
      name,
      start_date: start,
      end_date: end,
      cadence: "custom",
    })
    .select()
    .single();
  if (planErr || !plan)
    throw new Error(planErr?.message ?? "Error creando plan");

  // 4) Inserta plan_days mapeando día->película por orden
  const rows = days.map((d, i) => ({
    plan_id: plan.id,
    day_date: d,
    movie_id: movieIds[i],
    status: "locked" as const,
  }));

  const { error: pdErr } = await supabase.from("plan_days").insert(rows);
  if (pdErr) throw new Error(pdErr.message);

  revalidatePath(`/plan/${plan.id}`);
  redirect(`/plan/${plan.id}`);
}
