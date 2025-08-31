// src/components/rehacer-plan-button.tsx
"use client";

import { deletePlanAction } from "@/app/plan/[id]/actions";
import { useState, useTransition } from "react";

export default function RehacerPlanButton({ planId }: { planId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full px-4 py-2 font-werebeast text-sm 
                   bg-halloweenAccent text-black 
                   hover:scale-105 transition-transform shadow-lg"
      >
        🔄 Rehacer plan
      </button>

      {open && (
        <div className="modal-backdrop">
          <div className="modal-panel rounded-2xl shadow-xl">
            <h2 className="font-werebeast text-xl mb-2 text-halloweenAccent">
              ¿Rehacer el plan?
            </h2>
            <p className="text-sm text-gray-200 mb-6">
              Se eliminará el plan actual y volverás al asistente de creación.
            </p>

            <form
              action={(fd) => {
                fd.set("planId", planId);
                startTransition(() => deletePlanAction(fd));
              }}
              className="flex justify-end gap-3"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 border border-gray-400 
                           text-gray-200 hover:bg-gray-700 transition"
                disabled={pending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-full px-4 py-2 font-werebeast
                           bg-halloweenUnlocked text-white 
                           hover:scale-105 transition-transform disabled:opacity-60"
                disabled={pending}
              >
                {pending ? "Rehaciendo…" : "Sí, rehacer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
