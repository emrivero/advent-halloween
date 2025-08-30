"use client";

import { useEffect, useMemo, useState } from "react";

type Movie = { title: string; img: string };
type MoviesFile = { date: string; movies: Movie[] };

// util simple de shuffle in-place
function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isUnlocked(day: number, monthIndex: number, now: Date) {
  // Mes de octubre = 9 (0-based). Mantengo tu regla:
  // "si hoy >= día y el mes es octubre, desbloquea"
  const today = now.getDate();
  const month = now.getMonth(); // 0-based
  return month === monthIndex && day <= today;
}

export default function HalloweenCalendarPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [dataDate, setDataDate] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    open: boolean;
    movie?: Movie;
    day?: number;
  }>({ open: false });

  // Carga movies.json desde /public (en Next se sirve estático)
  useEffect(() => {
    (async () => {
      const res = await fetch("/movies.json", { cache: "no-store" });
      const json: MoviesFile = await res.json();
      setDataDate(json.date);

      const ls = localStorage.getItem("data");
      let selected: Movie[] = [];

      if (ls) {
        const prev = JSON.parse(ls) as MoviesFile;
        if (prev.date !== json.date) {
          // Nueva versión -> reshuffle
          selected = shuffle([...json.movies]);
          localStorage.setItem("movies", JSON.stringify(selected));
          localStorage.setItem("data", JSON.stringify(json));
        } else {
          // Misma versión -> reusar orden
          const cached = localStorage.getItem("movies");
          if (cached) selected = JSON.parse(cached);
          else {
            selected = shuffle([...json.movies]);
            localStorage.setItem("movies", JSON.stringify(selected));
          }
        }
      } else {
        // Primera vez
        selected = shuffle([...json.movies]);
        localStorage.setItem("movies", JSON.stringify(selected));
        localStorage.setItem("data", JSON.stringify(json));
      }

      setMovies(selected);
    })();
  }, []);

  const now = useMemo(() => new Date(), []);
  const OCTOBER_INDEX = 9; // 0-based: 9 = Octubre. Tu UI muestra 30 días (1..30)

  // Render de 30 días (1..30) como en tu HTML
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen font-werebeast">
      <header className="py-6">
        <h1 className="relative mx-auto inline-block text-4xl md:text-5xl font-bold text-halloweenAccent">
          Calendario de Halloween
        </h1>
        {dataDate && (
          <p className="mt-2 text-white/70 text-sm">
            Catálogo versión: {dataDate}
          </p>
        )}
      </header>

      <section
        className="
          grid justify-items-center gap-2 p-5
          [grid-template-columns:repeat(7,minmax(0,1fr))]
          max-[1200px]:[grid-template-columns:repeat(5,minmax(0,1fr))]
          max-[992px]:[grid-template-columns:repeat(4,minmax(0,1fr))]
          max-[768px]:[grid-template-columns:repeat(3,minmax(0,1fr))]
          max-[576px]:[grid-template-columns:repeat(2,minmax(0,1fr))]
          max-[400px]:[grid-template-columns:repeat(1,minmax(0,1fr))]
        "
      >
        {days.map((day) => {
          const unlocked = isUnlocked(day, OCTOBER_INDEX, now);
          const movie = movies[day - 1]; // 1-based -> 0-based
          return (
            <button
              key={day}
              className={[
                "relative m-8 flex h-[120px] w-[120px] items-center justify-center cursor-pointer rounded-pumpkin md:h-[140px] md:w-[140px] lg:h-[160px] lg:w-[160px]",
                unlocked
                  ? "bg-halloweenAccent/65 bg-pumpkin bg-cover bg-center hover:bg-halloweenAccent hover:mix-blend-multiply transition-colors"
                  : "bg-halloweenAccent/65",
              ].join(" ")}
              onClick={() => {
                if (!unlocked || !movie) return;
                setModal({ open: true, movie, day });
              }}
            >
              {!unlocked && <span className="lock" aria-hidden="true" />}
              <div
                className="
                absolute -bottom-14 flex h-[45px] w-[45px] items-center justify-center rounded-full border-2 border-halloweenAccent bg-black/70 text-white text-sm md:h-[50px] md:w-[50px] md:text-base lg:h-[54px] lg:w-[54px]
              "
              >
                Día {day}
              </div>
            </button>
          );
        })}
      </section>

      {/* Modal */}
      {modal.open && modal.movie && (
        <div
          className="modal-backdrop"
          onClick={() => setModal({ open: false })}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">
                Película recomendada para el día {modal.day}:{" "}
                {modal.movie.title}
              </h2>
              <button
                onClick={() => setModal({ open: false })}
                className="text-halloweenAccent text-2xl leading-none"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modal.movie.img}
                alt={modal.movie.title}
                className="mx-auto max-h-[60vh] w-auto rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
