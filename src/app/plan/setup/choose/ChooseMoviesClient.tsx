"use client";

import MovieSearch from "@/components/MoviesSearch";
import { Movie, useMovieData } from "@/hooks/useMovieData";
import { useMemo, useState } from "react";
import { createPlanFromSelectionAction } from "./actions";

/** Placeholder inicial — aquí meterás los datos finales (TMDB) */
const SPOOKY = [
  { id: "spk-coraline", title: "Coraline", poster_url: null, tags: ["Spooky"] },
  {
    id: "spk-nb4xmas",
    title: "Pesadilla Antes de Navidad",
    poster_url: null,
    tags: ["Spooky"],
  },
  {
    id: "spk-frankenweenie",
    title: "Frankenweenie",
    poster_url: null,
    tags: ["Spooky"],
  },
];
const SOBRENATURAL = [
  {
    id: "sn-warren",
    title: "Expediente Warren",
    poster_url: null,
    tags: ["Sobrenatural"],
  },
  {
    id: "sn-ring",
    title: "The Ring",
    poster_url: null,
    tags: ["Sobrenatural"],
  },
  {
    id: "sn-others",
    title: "Los Otros",
    poster_url: null,
    tags: ["Sobrenatural"],
  },
];
const SLASHER = [
  {
    id: "sl-friday13",
    title: "Viernes 13",
    poster_url: null,
    tags: ["Slasher"],
  },
  {
    id: "sl-texas",
    title: "La matanza de Texas",
    poster_url: "/6GVnIHoUDsqf1ICQR9ovRReuNke.jpg",
    tags: ["Slasher"],
  },
  {
    id: "sl-halloween",
    title: "Halloween",
    poster_url: null,
    tags: ["Slasher"],
  },
];

export default function ChooseMoviesClient({
  name,
  days,
}: {
  name: string;
  days: string[];
}) {
  const target = days.length;
  const [selected, setSelected] = useState<Movie[]>([]);
  const [tab, setTab] = useState<
    "Spooky" | "Sobrenatural" | "Slasher" | "Buscar"
  >("Spooky");

  const spooky = useMovieData("movies_spooky_cache");
  const slasher = useMovieData("movies_slasher_cache");
  const supernatural = useMovieData("movies_supernatural_cache");

  const pools: Record<string, Movie[]> = useMemo(
    () => ({
      Spooky: spooky.movies,
      Sobrenatural: supernatural.movies,
      Slasher: slasher.movies,
    }),
    [spooky.movies, slasher.movies, supernatural.movies]
  );

  const remaining = target - selected.length;

  const togglePick = (m: Movie) => {
    setSelected((prev) => {
      const exists = prev.find((p) =>
        p.id ? p.id === m.id : p.title === m.title
      );
      if (exists)
        return prev.filter((p) => (p.id ? p.id !== m.id : p.title !== m.title));
      if (prev.length >= target) return prev; // no exceder
      return [...prev, m];
    });
  };

  const removeAt = (idx: number) =>
    setSelected((prev) => prev.filter((_, i) => i !== idx));

  const submit = async () => {
    if (selected.length !== target)
      return alert(
        `Debes elegir exactamente ${target} películas (te faltan ${remaining}).`
      );
    await createPlanFromSelectionAction({
      name,
      days,
      movies: selected,
    });
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-halloweenAccent">
        Elige {target} película{target === 1 ? "" : "s"}
      </h1>
      <p className="text-white/70">
        Puedes mezclar categorías o añadir películas personalizadas.
      </p>

      {/* Tabs */}
      <div className="mt-4 inline-flex rounded-md border border-white/15 p-1">
        {(["Spooky", "Sobrenatural", "Slasher", "Buscar"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "px-3 py-1.5 text-sm rounded-md",
              tab === t ? "bg-white text-gray-900" : "hover:bg-white/5",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Seleccionadas (orden final) */}
      <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm text-white/80">
            Seleccionadas:{" "}
            <strong>
              {selected.length}/{target}
            </strong>{" "}
          </div>
        </div>
        {selected.length ? (
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((m, i) => (
              <li
                key={`${m.id ?? "custom"}-${i}`}
                className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.poster_url ?? "/img/pumpkin.png"}
                  alt={m.title}
                  className="h-12 w-8 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium leading-tight">
                    {i + 1}. {m.title}
                  </div>
                  {!!m.tags?.length && (
                    <div className="text-xs text-white/60">
                      {m.tags.join(" · ")}
                    </div>
                  )}
                  {m.year && (
                    <div className="text-xs text-white/60">{m.year}</div>
                  )}
                  {m.isCustom && (
                    <div className="text-xs text-[#10b981]">Custom</div>
                  )}
                </div>
                <button
                  onClick={() => removeAt(i)}
                  className="rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/5"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-white/60">Aún no has añadido películas.</p>
        )}
      </div>

      {/* CTA final */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <div className="text-sm text-white/70">
          Restantes: <strong>{remaining}</strong>
        </div>
        <button
          onClick={submit}
          disabled={selected.length !== target}
          className={
            selected.length === target
              ? "rounded-md bg-white px-4 py-2 text-gray-900"
              : "rounded-md border border-white/15 px-4 py-2 text-white/60 cursor-not-allowed"
          }
        >
          Crear plan
        </button>
      </div>

      {/* Grid de la pestaña */}
      {tab !== "Buscar" ? (
        <div
          className="
          mt-4 grid gap-4
          [grid-template-columns:repeat(6,minmax(0,1fr))]
          max-[1280px]:[grid-template-columns:repeat(5,minmax(0,1fr))]
          max-[1024px]:[grid-template-columns:repeat(4,minmax(0,1fr))]
          max-[768px]:[grid-template-columns:repeat(3,minmax(0,1fr))]
          max-[560px]:[grid-template-columns:repeat(2,minmax(0,1fr))]
        "
        >
          {pools[tab].map((m) => {
            const picked = !!selected.find((p) =>
              p.id ? p.id === m.id : p.title === m.title
            );
            return (
              <button
                key={m.id ?? m.title}
                onClick={() => togglePick(m)}
                className={[
                  "relative overflow-hidden rounded-xl border p-2 text-left",
                  picked
                    ? "bg-white text-gray-900"
                    : "border-white/15 hover:bg-white/5",
                ].join(" ")}
                title={m.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.poster_url ?? "/img/pumpkin.png"}
                  alt={m.title}
                  className="aspect-[2/3] w-full rounded-md object-cover opacity-60"
                />
                <div className="mt-2 text-sm font-medium">{m.title}</div>
                <div className="text-xs text-white/60">
                  {m.tags?.join(" · ")}
                </div>
                <div className="text-xs text-white/60">{m.year}</div>
                {picked && (
                  <span className="absolute right-2 top-2 rounded-full bg-[#22c55e] px-2 py-0.5 text-xs">
                    Añadida
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4">
          <MovieSearch
            maxRemaining={target - selected.length}
            onAdd={(movie) => {
              if (selected.length >= target) return;
              setSelected((prev) => [
                ...prev,
                {
                  // NO usar id aquí (id es para UUID interno)
                  tmdb_id: movie.tmdb_id, // <- externo
                  imdb_id: movie.imdb ?? null, // <- externo
                  title: movie.title,
                  poster_url: movie.poster_url ?? null,
                  tags: movie.genres ?? [],
                  isCustom: true,
                } as any, // si TS protesta hasta que tipemos
              ]);
            }}
          />
        </div>
      )}
    </div>
  );
}
