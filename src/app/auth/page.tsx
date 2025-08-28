"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}` }});
    if (error) setError(error.message);
    else setSent(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="mb-6 text-2xl font-semibold">Acceso</h1>

      {!sent ? (
        <form onSubmit={sendMagicLink} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-gray-300">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-white/10 bg-gray-900 p-2"
              placeholder="tucorreo@ejemplo.com"
            />
          </label>
          <button className="rounded-md bg-white px-4 py-2 text-gray-900">Enviar magic link</button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      ) : (
        <div className="grid gap-3">
          <p className="text-green-400">Te enviamos un enlace de acceso. Revisa tu correo.</p>
          <button onClick={signOut} className="rounded-md border border-white/10 px-4 py-2">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
