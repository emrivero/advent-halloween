"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setAllowedAction(movieId: string, allowed: boolean) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No autenticado");

  if (allowed) {
    // upsert allowed=true (peso por defecto 1)
    const { error: upErr } = await supabase.from("user_catalog").upsert({
      user_id: user.id,
      movie_id: movieId,
      allowed: true,
      weight: 1,
    });
    if (upErr) throw new Error(upErr.message);
  } else {
    // marca allowed=false (lo mantenemos para peso futuro)
    const { error: upErr } = await supabase.from("user_catalog").upsert({
      user_id: user.id,
      movie_id: movieId,
      allowed: false,
      weight: 1,
    });
    if (upErr) throw new Error(upErr.message);
  }

  // refresca /catalog en SSR/ISR si hiciera falta
  revalidatePath("/catalog");
}
