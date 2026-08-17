"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("registro"); // "registro" | "ingreso"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "registro") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        // Con "Confirm email" desactivado en Supabase, signUp ya devuelve sesión activa.
        if (data.session) {
          router.push("/votar");
          router.refresh();
          return;
        }

        // Si por algún motivo no hay sesión inmediata, intenta iniciar sesión directo.
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        router.push("/votar");
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        router.push("/votar");
        router.refresh();
      }
    } catch (err) {
      setError(traducirError(err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 text-center font-display text-3xl leading-tight tracking-wide-display text-crust">
        PIZZA FEST <span className="text-tomato">MAGANGUÉ</span>
      </Link>

      <div className="mb-6 flex rounded-full bg-char p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("registro")}
          className={`flex-1 rounded-full py-2 font-semibold transition ${
            mode === "registro" ? "bg-tomato text-mozzarella" : "text-mozzarella/50"
          }`}
        >
          Registrarme
        </button>
        <button
          type="button"
          onClick={() => setMode("ingreso")}
          className={`flex-1 rounded-full py-2 font-semibold transition ${
            mode === "ingreso" ? "bg-tomato text-mozzarella" : "text-mozzarella/50"
          }`}
        >
          Ya tengo cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-mono text-smoke">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-mozzarella/15 bg-char px-4 py-3 text-mozzarella outline-none focus:border-crust"
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-mono text-smoke">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-mozzarella/15 bg-char px-4 py-3 text-mozzarella outline-none focus:border-crust"
            placeholder="mínimo 6 caracteres"
            autoComplete={mode === "registro" ? "new-password" : "current-password"}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-tomato/10 px-3 py-2 text-sm text-tomato">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-tomato py-3 font-semibold text-mozzarella transition hover:bg-tomatodark disabled:opacity-50"
        >
          {loading
            ? "Un momento…"
            : mode === "registro"
            ? "Crear cuenta y votar"
            : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-smoke">
        Al registrarte podrás votar de inmediato, sin confirmar el correo.
      </p>
    </main>
  );
}

function traducirError(msg = "") {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists")) {
    return "Ese correo ya está registrado. Prueba con \"Ya tengo cuenta\".";
  }
  if (m.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (m.includes("password") && m.includes("6")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return msg || "Ocurrió un error. Intenta de nuevo.";
}
