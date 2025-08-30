import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-white/80 text-sm">
          Bienvenido, <strong>{user.email}</strong>
        </span>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="rounded-md border border-white/15 px-3 py-1 text-sm hover:bg-white/5"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link href="/auth" className="rounded-md bg-white px-4 py-2 text-gray-900">
      Entrar
    </Link>
  );
}
