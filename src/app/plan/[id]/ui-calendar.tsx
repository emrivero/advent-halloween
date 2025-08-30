"use client";

import { Check, Lock, Unlock, X } from "lucide-react";
import { useState } from "react";
import { setDayStatusAction, unlockTodayAction } from "./actions";

type Movie = {
  id: string;
  title: string;
  poster_url?: string;
  runtime_min?: number;
  tags?: string[];
};

type Day = {
  id: string;
  day_date: string; // YYYY-MM-DD
  status: "locked" | "unlocked" | "watched" | "skipped";
  movie: Movie;
};

type Props = {
  days: Day[];
  planId?: string;
};

function isUnlocked(dayDate: string, status: Day["status"]) {
  if (status !== "locked") return true;
  const todayStr = new Date().toISOString().slice(0, 10);
  return dayDate <= todayStr;
}

function statusStyles(status: Day["status"]) {
  // ring + badge color por estado
  switch (status) {
    case "watched":
      return {
        ring: "ring-2 ring-[#22c55e]",
        badgeBg: "bg-[#22c55e]",
        Icon: Check,
        label: "Visto",
      };
    case "skipped":
      return {
        ring: "ring-2 ring-[#ef4444]",
        badgeBg: "bg-[#ef4444]",
        Icon: X,
        label: "Saltado",
      };
    case "unlocked":
      return {
        ring: "ring-2 ring-[#10b981]/70",
        badgeBg: "bg-[#10b981]",
        Icon: Unlock,
        label: "Desbloqueado",
      };
    case "locked":
    default:
      return {
        ring: "ring-1 ring-[#835c08]/60",
        badgeBg: "bg-[#835c08]",
        Icon: Lock,
        label: "Bloqueado",
      };
  }
}

export default function Calendar({ days, planId }: Props) {
  const [modal, setModal] = useState<{
    open: boolean;
    movie?: Movie;
    day?: Day;
  }>({ open: false });

  return (
    <div>
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
        {days.map((d) => {
          const unlockedNow = isUnlocked(d.day_date, d.status);
          const { ring, badgeBg, Icon, label } = statusStyles(d.status);
          const clickable = unlockedNow && !!d.movie;

          return (
            <button
              key={d.id}
              className={[
                "relative m-8 flex h-[120px] w-[120px] items-center justify-center cursor-pointer rounded-[30%]",
                "md:h-[140px] md:w-[140px] lg:h-[160px] lg:w-[160px]",
                // Fondo calabaza cuando se puede abrir
                clickable
                  ? "bg-[#f0a500]/65 bg-[url('/img/pumpkin.png')] bg-cover bg-center hover:bg-[#f0a500] hover:mix-blend-multiply transition-colors"
                  : "bg-[#f0a500]/65",
                ring,
              ].join(" ")}
              onClick={() => {
                if (!clickable) return;
                setModal({ open: true, movie: d.movie, day: d });
              }}
              title={`${label} · ${d.day_date}`}
              aria-label={`${label} · ${d.day_date}`}
            >
              {/* Candado grande sólo cuando está bloqueado y aún no toca */}
              {!unlockedNow && d.status === "locked" && (
                <span className="lock" aria-hidden="true" />
              )}

              {/* Badge de estado arriba-derecha */}
              <span
                className={[
                  "absolute right-2 top-2 inline-flex items-center justify-center rounded-full p-1.5",
                  "text-white shadow-md",
                  badgeBg,
                ].join(" ")}
                title={label}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </span>

              {/* Número del día */}
              <div
                className="
                  absolute -bottom-14 flex h-[45px] w-[45px] items-center justify-center rounded-full
                  border-2 border-[#f0a500] bg-black/70 text-white text-sm
                  md:h-[50px] md:w-[50px] md:text-base
                  lg:h-[54px] lg:w-[54px]
                "
              >
                {new Date(d.day_date).getDate()}
              </div>
            </button>
          );
        })}
      </section>

      {/* Leyenda */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80">
        <LegendDot
          color="#835c08"
          icon={<Lock className="h-3.5 w-3.5" />}
          label="Bloqueado"
        />
        <LegendDot
          color="#10b981"
          icon={<Unlock className="h-3.5 w-3.5" />}
          label="Desbloqueado"
        />
        <LegendDot
          color="#22c55e"
          icon={<Check className="h-3.5 w-3.5" />}
          label="Visto"
        />
        <LegendDot
          color="#ef4444"
          icon={<X className="h-3.5 w-3.5" />}
          label="Saltado"
        />
      </div>

      {/* Modal */}
      {modal.open && modal.movie && modal.day && (
        <div
          className="modal-backdrop"
          onClick={() => setModal({ open: false })}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">
                {modal.day.day_date}: {modal.movie.title}
              </h2>
              <button
                onClick={() => setModal({ open: false })}
                className="text-[#f0a500] text-2xl leading-none"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>

            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modal.movie.poster_url ?? ""}
                alt={modal.movie.title}
                className="mx-auto max-h-[60vh] w-auto rounded-md"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={async () => {
                  await setDayStatusAction(modal.day!.id, "watched");
                  setModal({ open: false });
                }}
                className="rounded-md bg-white px-4 py-2 text-gray-900"
              >
                Marcar visto ✓
              </button>
              <button
                onClick={async () => {
                  await setDayStatusAction(modal.day!.id, "skipped");
                  setModal({ open: false });
                }}
                className="rounded-md border border-white/15 px-4 py-2 hover:bg-white/5"
              >
                Saltar
              </button>
              {planId && (
                <button
                  onClick={async () => {
                    await unlockTodayAction(planId);
                    setModal({ open: false });
                  }}
                  className="rounded-md border border-white/15 px-4 py-2 hover:bg-white/5"
                  title="Desbloquear los días hasta hoy"
                >
                  Desbloquear hoy
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendDot({
  color,
  icon,
  label,
}: {
  color: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2 py-1">
      <span
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-white"
        style={{ background: color }}
      >
        {icon}
      </span>
      {label}
    </span>
  );
}
