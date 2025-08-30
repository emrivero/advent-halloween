"use client";

import { addDays, eachDayOfInterval, format } from "date-fns";
import { useMemo, useState } from "react";
import { createPlanAction } from "./actions";

type Strategy = "daily" | "weekends" | "3_per_week" | "custom";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function PlanSetupClient() {
  const today = new Date();
  const [name, setName] = useState("Mi plan 2025");
  const [start, setStart] = useState(iso(today));
  const [end, setEnd] = useState(iso(addDays(today, 29)));
  const [count, setCount] = useState(13);
  const [strategy, setStrategy] = useState<Strategy>("daily");
  const [customDays, setCustomDays] = useState<string[]>([]); // YYYY-MM-DD

  const rangeDays = useMemo(
    () =>
      eachDayOfInterval({ start: new Date(start), end: new Date(end) }).map(
        iso
      ),
    [start, end]
  );

  const toggleCustom = (d: string) => {
    setCustomDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()
    );
  };

  const submit = async () => {
    await createPlanAction({
      name,
      startDate: start,
      endDate: end,
      count,
      strategy,
      customDays: strategy === "custom" ? customDays : [],
    });
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-left">
          <span className="text-sm text-white/80">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </label>
        <label className="text-left">
          <span className="text-sm text-white/80">Número de películas</span>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </label>
        <label className="text-left">
          <span className="text-sm text-white/80">Inicio</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </label>
        <label className="text-left">
          <span className="text-sm text-white/80">Fin</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </label>
      </div>

      <div className="text-left">
        <span className="text-sm text-white/80">Estrategia</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          {(["daily", "weekends", "3_per_week", "custom"] as Strategy[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStrategy(s)}
                className={[
                  "rounded-md border px-3 py-2 text-sm",
                  strategy === s
                    ? "bg-white text-gray-900"
                    : "border-white/15 hover:bg-white/5",
                ].join(" ")}
              >
                {s === "daily"
                  ? "Diario"
                  : s === "weekends"
                  ? "Fines de semana"
                  : s === "3_per_week"
                  ? "3/semana"
                  : "Custom"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Calendario custom simple */}
      {strategy === "custom" && (
        <div className="mt-4">
          <p className="text-left text-white/80 text-sm mb-2">
            Selecciona días concretos dentro del rango:
          </p>
          <div
            className="
            grid gap-2
            [grid-template-columns:repeat(7,minmax(0,1fr))]
            max-[768px]:[grid-template-columns:repeat(5,minmax(0,1fr))]
            max-[560px]:[grid-template-columns:repeat(3,minmax(0,1fr))]
          "
          >
            {rangeDays.map((d) => {
              const selected = customDays.includes(d);
              const dayNum = new Date(d).getDate();
              return (
                <button
                  key={d}
                  onClick={() => toggleCustom(d)}
                  className={[
                    "relative h-[80px] rounded-[16px] border",
                    selected
                      ? "bg-white text-gray-900"
                      : "border-white/15 hover:bg-white/5",
                  ].join(" ")}
                  title={d}
                >
                  <div className="absolute top-2 left-2 text-xs opacity-70">
                    {format(new Date(d), "LLL d")}
                  </div>
                  <div className="h-full flex items-center justify-center text-2xl">
                    {dayNum}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-white/60 text-left">
            Seleccionados: {customDays.length}
          </p>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={submit}
          className="rounded-md bg-white px-4 py-2 text-gray-900"
        >
          Generar plan
        </button>
      </div>
    </div>
  );
}
