import { ArrowRight } from "lucide-react"; // opcional: pnpm add lucide-react
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl py-10 font-werebeast">
      {/* Hero */}
      <section className="grid gap-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-halloweenAccent">
          Tu maratón de Halloween, a tu ritmo
        </h1>
        <p className="mx-auto max-w-2xl text-white/80">
          Elige cuántas pelis quieres ver y en qué días. Desbloquea cada jornada y marca tu progreso.
          Empieza en modo demo o crea tu plan personalizado con cuenta.
        </p>
      </section>

      {/* Cards */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {/* FULL (destacada) */}
        <div className="
          relative overflow-hidden rounded-2xl p-1 
          bg-gradient-to-br from-halloweenUnlocked/70 via-halloweenAccent/60 to-halloweenLocked/60
          shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="rounded-2xl bg-gray-950/95 p-6 md:p-7 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-semibold">Versión Full</h2>
              <span className="rounded-full bg-halloweenUnlocked/20 text-halloweenUnlocked px-3 py-1 text-xs tracking-wide">
                Recomendado
              </span>
            </div>
            <p className="mt-3 text-white/80">
              Crea un plan a medida: número de pelis, días concretos (findes, 3/semana, etc.),
              progreso sincronizado y opción de compartir tu calendario.
            </p>

            <ul className="mt-5 space-y-2 text-left text-white/80">
              <li>• Selección de catálogo personal</li>
              <li>• Desbloqueo por fecha según tu zona horaria</li>
              <li>• Guardado en la nube y enlaces compartibles</li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-lg bg-white text-gray-900 px-4 py-2 font-medium hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Crear mi plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <span className="text-sm text-white/60">Necesita registro o login</span>
            </div>
          </div>
        </div>

        {/* SIMPLE (demo) */}
        <div className="rounded-2xl border border-white/10 bg-gray-950/70 p-6 md:p-7">
          <h2 className="text-2xl md:text-3xl font-semibold">Versión Simple</h2>
          <p className="mt-3 text-white/80">
            Prueba rápida sin cuenta: calendario clásico de octubre, una peli por día,
            desbloqueo automático y orden aleatorio local.
          </p>

          <ul className="mt-5 space-y-2 text-left text-white/80">
            <li>• Sin registro, sin fricción</li>
            <li>• Basado en tu dispositivo (localStorage)</li>
            <li>• Estilo “Advent Halloween” original</li>
          </ul>

          <div className="mt-6">
            <Link
              href="/halloween"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Probar demo
            </Link>
          </div>
        </div>
      </section>

      {/* Nota legal / footer mini */}
      <p className="mt-10 text-center text-sm text-white/50">
        Hecho con Next.js + Supabase · No compartimos datos con terceros
      </p>
    </div>
  );
}
