"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthForm() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setErr(error.message);
    else setSent(true);
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="mb-4 text-2xl font-semibold">Acceso</h1>
      {!sent ? (
        <form onSubmit={sendMagicLink} className="grid gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-white/10 bg-gray-900 p-2"
            placeholder="tucorreo@ejemplo.com"
          />
          <button className="rounded-md bg-white px-4 py-2 text-gray-900">
            Enviar magic link
          </button>
          {err && <p className="text-sm text-red-400">{err}</p>}
        </form>
      ) : (
        <p className="text-green-400">
          Te enviamos un enlace de acceso. Revisa tu correo.
        </p>
      )}
    </div>
  );
}
