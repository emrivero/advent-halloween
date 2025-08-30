import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PlanSetupClient from "./PlanSetupClient";

export default async function PlanSetupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="text-3xl font-bold text-[#f0a500]">
        Halloween a tu gusto
      </h1>
      <p className="text-white/70 mt-1">
        Elige qué dias quieres ver tus películas favoritas.
      </p>
      <PlanSetupClient />
    </div>
  );
}
