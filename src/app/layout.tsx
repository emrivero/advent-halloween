import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Advent Halloween",
  description: "Planifica tu maratón de Halloween sin liarte",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <header className="border-b border-white/10">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold">
              🎃 Advent Halloween
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth" className="rounded-md border border-white/10 px-3 py-1.5 hover:bg-white/5">
                Entrar
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
