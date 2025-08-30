import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold">Hola, {user.email}</h1>
      <p className="text-gray-300">Aquí pondremos tu progreso y planes.</p>
    </div>
  );
}
