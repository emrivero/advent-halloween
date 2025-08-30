// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,

        set: (name: string, value: string, options?: any) =>
          res.cookies.set({ name, value, ...options }),
        remove: (name: string, options?: any) =>
          res.cookies.set({ name, value: "", ...options }),
      },
    }
  );

  // Esto refresca token si toca y asegura cookies válidas
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: [
    "/((?!auth/callback|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|woff2)$).*)",
  ],
};
