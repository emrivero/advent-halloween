import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildPosterUrl, normalizeQuery, SEARCH_TTL_MS } from "@/lib/tmdb";
import { NextResponse } from "next/server";

const TMDB_URL = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    if (!q) return NextResponse.json({ results: [] });

    const nq = normalizeQuery(q);

    const supabase = await createSupabaseServerClient();

    // 1) Cache hit?
    const { data: cache } = await supabase
      .from("search_cache")
      .select("results, updated_at")
      .eq("q_normalized", nq)
      .maybeSingle();

    const now = Date.now();
    if (cache?.results && cache?.updated_at) {
      const age = now - new Date(cache.updated_at).getTime();
      if (age < SEARCH_TTL_MS) {
        return NextResponse.json({ results: cache.results });
      }
    }

    // 2) Fetch TMDB
    const key = process.env.TMDB_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "TMDB_API_KEY missing" },
        { status: 500 }
      );
    }

    const url = `${TMDB_URL}/search/movie?query=${encodeURIComponent(
      q
    )}&language=es-ES&include_adult=false&page=1`;
    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${key.startsWith("ey") ? key : ""}`,
        accept: "application/json",
      },
    });

    // Nota: TMDB acepta API key como query param ?api_key=... o Bearer v4; soportamos ambas:
    const ok = r.ok;
    const data = ok ? await r.json() : null;
    if (!ok || !data) {
      // fallback: intentar con api_key (v3) si la env var no es token v4
      if (!key.startsWith("ey")) {
        const r2 = await fetch(`${url}&api_key=${key}`, {
          headers: { accept: "application/json" },
        });
        if (!r2.ok) {
          const t = await r2.text();
          return NextResponse.json(
            { error: `TMDB search error: ${t}` },
            { status: r2.status }
          );
        }
        const data2 = await r2.json();
        const results2 = mapSearchResults(data2);
        // guarda en cache
        await upsertSearchCache(nq, results2);
        return NextResponse.json({ results: results2 });
      }
      const t = await r.text();
      return NextResponse.json(
        { error: `TMDB search error: ${t}` },
        { status: r.status }
      );
    }

    const results = mapSearchResults(data);
    await upsertSearchCache(nq, results);
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Search error" },
      { status: 500 }
    );
  }
}

function mapSearchResults(data: any) {
  const list = Array.isArray(data?.results) ? data.results : [];
  return list.slice(0, 10).map((m: any) => ({
    tmdb_id: m?.id ?? null,
    title: m?.title ?? m?.name ?? "",
    year: (m?.release_date || "").slice(0, 4) || null,
    release_date: m?.release_date ?? null,
    poster_url: buildPosterUrl(m?.poster_path) ?? null,
    overview: m?.overview ?? "",
    vote_average: m?.vote_average ?? null,
  }));
}

// upsert en caché (sin RLS)
async function upsertSearchCache(nq: string, results: any[]) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase
      .from("search_cache")
      .upsert({
        q_normalized: nq,
        results,
        updated_at: new Date().toISOString(),
      })
      .select()
      .limit(1);
  } catch {
    /* ignore cache errors */
  }
}
