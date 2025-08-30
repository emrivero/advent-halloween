"use client";

import { useState } from "react";
import { createShareLinkAction, revokeShareLinkAction } from "./share-actions";

export default function SharePanel({
  planId,
  existingToken,
}: {
  planId: string;
  existingToken: string | null;
}) {
  const [token, setToken] = useState(existingToken);
  const url = token ? `${location.origin}/share/${token}` : null;

  const createLink = async () => {
    const res = await createShareLinkAction(planId);
    setToken(res.token);
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/share/${res.token}`
      );
      alert("Enlace copiado al portapapeles");
    } catch {
      // noop
    }
  };

  const revoke = async () => {
    await revokeShareLinkAction(planId);
    setToken(null);
  };

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left">
          <div className="font-medium">Compartir plan</div>
          <div className="text-white/70 text-sm">
            Genera un enlace de solo lectura para compartir tu calendario.
          </div>
        </div>
        <div className="flex gap-2">
          {!token ? (
            <button
              onClick={createLink}
              className="rounded-md bg-white px-3 py-2 text-gray-900"
            >
              Crear enlace
            </button>
          ) : (
            <>
              <a
                href={url!}
                target="_blank"
                className="rounded-md border border-white/15 px-3 py-2 hover:bg-white/5"
              >
                Abrir enlace
              </a>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(url!);
                  alert("Copiado");
                }}
                className="rounded-md border border-white/15 px-3 py-2 hover:bg-white/5"
              >
                Copiar
              </button>
              <button
                onClick={revoke}
                className="rounded-md border border-white/15 px-3 py-2 hover:bg-white/5"
              >
                Revocar
              </button>
            </>
          )}
        </div>
      </div>
      {token && <p className="mt-2 text-xs text-white/50 break-all">{url}</p>}
    </div>
  );
}
