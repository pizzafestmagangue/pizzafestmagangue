"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar({ email, isAdmin }) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-mozzarella/10 bg-oven/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl leading-tight tracking-wide-display text-crust">
          PIZZA FEST <span className="text-tomato">MAGANGUÉ</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {email && (
            <span className="hidden font-mono text-xs text-smoke sm:inline">{email}</span>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full border border-crust/40 px-3 py-1 text-xs font-mono text-crust hover:bg-crust/10"
            >
              admin
            </Link>
          )}
          {email ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-mozzarella/10 px-3 py-1 text-xs hover:bg-mozzarella/20"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-tomato px-3 py-1 text-xs font-semibold hover:bg-tomatodark"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
