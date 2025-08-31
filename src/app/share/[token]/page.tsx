import Calendar from "@/app/plan/[id]/ui-calendar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEffectiveToday } from "@/lib/time";

type Row = {
  id: string;
  day_date: string; // YYYY-MM-DD
  title: string;
  poster_url: string | null;
};

export default async function SharePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createSupabaseServerClient();

  // Cargamos días proyectados por la vista pública
  const { data: rows } = await supabase
    .from("shared_plan_days")
    .select("id, day_date, title, poster_url")
    .eq("token", params.token)
    .order("day_date");

  if (!rows || rows.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-semibold text-halloweenAccent">
          Enlace no válido o caducado
        </h1>
        <p className="text-white/70 mt-1">
          Pide a quien te lo envió que genere uno nuevo.
        </p>
      </div>
    );
  }

  const today = await getEffectiveToday();
  const start = rows[0]?.day_date;
  const end = rows[rows.length - 1]?.day_date;

  // Adaptamos a la forma del Calendar (Day + Movie mínimos)
  type Day = {
    id: string;
    day_date: string;
    status: "locked" | "unlocked" | "watched" | "skipped";
    movie: { id: string; title: string; poster_url?: string | null };
  };

  const days: Day[] = rows.map((r) => ({
    id: r.id,
    day_date: r.day_date,
    status: r.day_date <= today ? "unlocked" : "locked",
    movie: {
      id: r.id,
      title: r.title,
      poster_url: r.poster_url,
    },
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
      <header className="flex items-center justify-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-halloweenAccent">
            Plan compartido
          </h1>
          <p className="text-white/70 text-sm">
            {start} → {end} · {rows.length} días
          </p>
          <p className="text-white/50 text-xs mt-1">
            Vista pública de solo lectura · los pósters futuros permanecen
            ocultos 🎃
          </p>
        </div>
      </header>

      {/* Calendar en modo lectura (sin acciones) */}
      <Calendar days={days as any} today={today} readOnly />
    </div>
  );
}
