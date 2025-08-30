import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "implicit", // ← usa implícito en web (sin PKCE)
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // ← captura el token de la URL al volver del email
      },
    }
  );
}
