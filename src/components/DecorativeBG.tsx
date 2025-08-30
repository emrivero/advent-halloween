// src/components/DecorativeBG.tsx
export default function DecorativeBG() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Textura principal (tu telaraña) si la usas como background */}
      <div className="absolute top-[-300px] left-[-350px] inset-0 bg-[url('/img/spiderweb.svg')] bg-no-repeat  opacity-20" />

      {/* Fantasma flotando (arriba-dcha) */}
      <img
        src="/img/ghost.svg"
        alt=""
        className="
          absolute right-6 top-8 h-20 w-auto opacity-30
          max-md:right-2 max-md:top-4 max-md:h-14
          animate-float
        "
      />

      {/* Calabaza (abajo-izda) */}
      <img
        src="/img/pumpkin.svg"
        alt=""
        className="
          absolute bottom-6 left-6 h-16 w-auto opacity-40
          max-md:bottom-1 max-md:left-3 max-md:h-12
          animate-bob
          z-index-1
        "
      />

      {/* Tumba (lateral) */}
      <img
        src="/img/rip.svg"
        alt=""
        className="
          absolute bottom-10 right-[15%] h-14 w-auto opacity-25
          max-md:right-4 max-md:bottom-6 max-md:h-10
          animate-drift
        "
      />

      {/* Un par de murciélagos “silueta” si quieres repetir la calabaza en peque */}
      {/* <img src="/assets/pumpkin.svg" alt="" className="absolute left-[35%] top-[20%] h-6 opacity-20 rotate-12" />
      <img src="/assets/ghost.svg" alt="" className="absolute left-[8%] top-[60%] h-8 opacity-15 -rotate-6" /> */}
    </div>
  );
}
