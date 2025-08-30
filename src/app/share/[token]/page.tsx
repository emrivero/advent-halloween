import { createSupabaseServerClient } from "@/lib/supabase/server";

type Row = {
  id: string;
  day_date: string;
  title: string;
  poster_url: string | null;
};

export default async function SharePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: rows } = await supabase
    .from("shared_plan_days")
    .select("id, day_date, title, poster_url")
    .eq("token", params.token)
    .order("day_date");

  if (!rows || rows.length === 0) {
    return (
      <div className="py-10">
        <h1 className="text-2xl font-semibold">Enlace no válido o caducado</h1>
        <p className="text-white/70">
          Pide a quien te lo envió que genere uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-[#f0a500]">Plan compartido</h1>
      <p className="text-white/70 text-sm">Vista de sólo lectura</p>

      <section
        className="
        mt-6 grid justify-items-center gap-2 p-2
        [grid-template-columns:repeat(7,minmax(0,1fr))]
        max-[1200px]:[grid-template-columns:repeat(5,minmax(0,1fr))]
        max-[992px]:[grid-template-columns:repeat(4,minmax(0,1fr))]
        max-[768px]:[grid-template-columns:repeat(3,minmax(0,1fr))]
        max-[576px]:[grid-template-columns:repeat(2,minmax(0,1fr))]
        max-[400px]:[grid-template-columns:repeat(1,minmax(0,1fr))]
      "
      >
        {rows.map((d) => (
          <article
            key={d.id}
            className="relative m-4 flex h-[140px] w-[140px] items-center justify-center rounded-[30%] bg-[#f0a500]/65"
            title={d.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.poster_url ?? "/img/pumpkin.png"}
              alt={d.title}
              className="absolute inset-0 h-full w-full rounded-[30%] object-cover opacity-30"
            />
            <div className="absolute -bottom-14 flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-[#f0a500] bg-black/70 text-white text-base">
              {new Date(d.day_date).getDate()}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
