import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SharePanel from "./share-panel";
import Calendar from "./ui-calendar";

export default async function PlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!plan) redirect("/");

  const { data: rows } = await supabase
    .from("plan_days")
    .select(
      "id, day_date, status, movie:movies(id, title, poster_url, runtime_min, tags)"
    )
    .eq("plan_id", plan.id)
    .order("day_date");

  // ¿Existe share_link?
  const { data: share } = await supabase
    .from("share_links")
    .select("token, created_at, expires_at")
    .eq("plan_id", plan.id)
    .maybeSingle();

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold">{plan.name ?? "Mi plan"}</h1>
      <p className="text-white/70 text-sm">
        {plan.start_date} → {plan.end_date} · {rows?.length ?? 0} días
      </p>

      <SharePanel planId={plan.id} existingToken={share?.token ?? null} />

      <Calendar days={(rows ?? []) as any} planId={plan.id} />
    </div>
  );
}
