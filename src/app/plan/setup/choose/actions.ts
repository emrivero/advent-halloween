// src/app/plan/setup/choose/actions.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type SelectedMovie = {
  id?: string;
  imdb_id?: string | null;
  tmdb_id?: number | null;
  title: string;
  poster_url?: string | null;
  tags?: string[] | null;
  isCustom?: boolean;
};

function isUuid(v: string | undefined): v is string {
  return (
    !!v &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      v
    )
  );
}

export async function createPlanFromSelectionAction(input: {
  name: string;
  days: string[]; // 'YYYY-MM-DD' ya ordenados
  movies: SelectedMovie[]; // misma longitud que days
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { name, days, movies } = input;
  if (!days.length) throw new Error("Sin días");
  if (movies.length !== days.length)
    throw new Error("El nº de películas debe igualar el nº de días");

  // 1) Clasifica indices
  const internalIdx: number[] = [];
  const externalIdx: number[] = [];
  const looseIdx: number[] = [];

  movies.forEach((m, i) => {
    if (m.id && isUuid(m.id)) internalIdx.push(i);
    else if (m.tmdb_id || m.imdb_id) externalIdx.push(i);
    else looseIdx.push(i);
  });

  // 2) Busca existentes por externos
  const extTmdb = Array.from(
    new Set(
      externalIdx.map((i) => movies[i].tmdb_id).filter((x): x is number => !!x)
    )
  );
  const extImdb = Array.from(
    new Set(
      externalIdx.map((i) => movies[i].imdb_id).filter((x): x is string => !!x)
    )
  );

  const foundByTmdb = extTmdb.length
    ? await supabase.from("movies").select("id, tmdb_id").in("tmdb_id", extTmdb)
    : { data: [] as { id: string; tmdb_id: number }[] };
  const foundByImdb = extImdb.length
    ? await supabase.from("movies").select("id, imdb_id").in("imdb_id", extImdb)
    : { data: [] as { id: string; imdb_id: string }[] };

  const tmdbMap = new Map<number, string>();
  foundByTmdb.data?.forEach(
    (row) => row.tmdb_id && tmdbMap.set(row.tmdb_id, row.id)
  );

  const imdbMap = new Map<string, string>();
  foundByImdb.data?.forEach(
    (row) => row.imdb_id && imdbMap.set(row.imdb_id, row.id)
  );

  // 3) Prepara inserciones faltantes
  type InsertMovie = {
    title: string;
    poster_url?: string | null;
    tags?: string[] | null;
    imdb_id?: string | null;
    tmdb_id?: number | null;
  };

  const toInsert: InsertMovie[] = [];
  const idxNeedingInsert: number[] = [];

  movies.forEach((m, i) => {
    if (internalIdx.includes(i)) return;

    if (externalIdx.includes(i)) {
      const has =
        (m.tmdb_id && tmdbMap.get(m.tmdb_id)) ||
        (m.imdb_id && imdbMap.get(m.imdb_id));
      if (has) return; // ya existe
      toInsert.push({
        title: m.title,
        poster_url: m.poster_url ?? null,
        tags: m.tags ?? null,
        imdb_id: m.imdb_id ?? null,
        tmdb_id: m.tmdb_id ?? null,
      });
      idxNeedingInsert.push(i);
      return;
    }

    // sueltos por título
    toInsert.push({
      title: m.title,
      poster_url: m.poster_url ?? null,
      tags: m.tags ?? null,
      imdb_id: null,
      tmdb_id: null,
    });
    idxNeedingInsert.push(i);
  });

  // 4) Inserta y recupera con title para poder casar
  let inserted: {
    id: string;
    imdb_id: string | null;
    tmdb_id: number | null;
    title: string;
  }[] = [];
  if (toInsert.length) {
    const { data, error } = await supabase
      .from("movies")
      .insert(toInsert)
      .select("id, imdb_id, tmdb_id, title"); // <- añadimos title para casarlo por nombre
    if (error) throw new Error(error.message);
    inserted = data ?? [];
  }

  // 5) Resolver UUID de cada movie en orden
  const movieIds: string[] = movies.map((m, i) => {
    // prioridad: interno → tmdb → imdb → recién insertado por tmdb/imdb → recién insertado por title
    if (m.id && isUuid(m.id)) return m.id;

    if (m.tmdb_id && tmdbMap.get(m.tmdb_id)) return tmdbMap.get(m.tmdb_id)!;
    if (m.imdb_id && imdbMap.get(m.imdb_id!)) return imdbMap.get(m.imdb_id!)!;

    if (m.tmdb_id) {
      const hit = inserted.find((x) => x.tmdb_id === m.tmdb_id);
      if (hit) return hit.id;
    }
    if (m.imdb_id) {
      const hit = inserted.find((x) => x.imdb_id === m.imdb_id);
      if (hit) return hit.id;
    }

    // custom puro (sin externos): casamos por título recién insertado
    const hitByTitle = inserted.find(
      (x) => !x.tmdb_id && !x.imdb_id && x.title === m.title
    );
    if (hitByTitle) return hitByTitle.id;

    throw new Error(`No se pudo resolver UUID para: ${m.title}`);
  });

  // 6) Crea plan (NO convertir fechas; usa strings)
  const start = days[0];
  const end = days[days.length - 1];
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

  console.log(days);

  // 7) Inserta plan_days mapeando por índice (1 a 1)
  const rows = days.map((d, i) => ({
    plan_id: plan.id,
    day_date: d, // <- string 'YYYY-MM-DD' tal cual
    movie_id: movieIds[i], // <- película i → día i
    status: "locked" as const,
  }));

  const { error: pdErr } = await supabase.from("plan_days").insert(rows);
  if (pdErr) throw new Error(pdErr.message);

  revalidatePath(`/plan/${plan.id}`);
  redirect(`/plan/${plan.id}`);
}
