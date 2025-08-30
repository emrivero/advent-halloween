// src/app/plan/setup/choose/page.tsx
import ChooseMoviesClient from "./ChooseMoviesClient";

export default function ChoosePage({
  searchParams,
}: {
  searchParams: { name?: string; days?: string };
}) {
  const name = searchParams.name ?? "Mi plan";
  const days = (searchParams.days ?? "").split(",").filter(Boolean);

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
