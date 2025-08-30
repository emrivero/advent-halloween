import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";

export default async function AuthPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // buscar si ya tiene plan
    const { data: plan } = await supabase
      .from("plans")
      .select("id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (plan) {
      redirect(`/plan/${plan.id}`);
    } else {
      redirect("/plan/setup");
    }
  }

  // no hay sesión -> muestra el form
  return <AuthForm />;
}
