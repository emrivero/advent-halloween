export const TMDB_IMAGE_BASE =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p/w500";

export function buildPosterUrl(p: string | null | undefined) {
  if (!p) return null;
  return `${TMDB_IMAGE_BASE}${p}`;
}

// Normaliza query: minúsculas + trim + espacios colapsados
export function normalizeQuery(q: string) {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

// TTL: 30 días (ms)
export const SEARCH_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const MOVIE_TTL_MS = 1000 * 60 * 60 * 24 * 30;
