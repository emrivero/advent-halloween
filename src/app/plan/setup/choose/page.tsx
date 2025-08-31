// src/app/plan/setup/choose/page.tsx
import ChooseMoviesClient from "./ChooseMoviesClient";

export default async function ChoosePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // helper para leer 1er valor si viene como array
  const pick = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

  const name = pick(sp.name) ?? "Mi plan";
  const daysCsv = pick(sp.days) ?? ""; // <- adiós .toString() a undefined
  const days = daysCsv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .sort(); // 'YYYY-MM-DD' ordena perfecto lexicográficamente

  if (!days.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 min-h-[80vh]">
        <h1 className="text-2xl font-semibold">Faltan días</h1>
        <p className="text-white/70">
          Vuelve al{" "}
          <a className="underline" href="/plan/setup">
            setup
          </a>{" "}
          para elegir fechas.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <ChooseMoviesClient name={name} days={days} />
    </div>
  );
}
