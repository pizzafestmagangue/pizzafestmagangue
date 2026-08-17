"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, isAdminEmail } from "@/lib/supabaseClient";
import { PIZZAS } from "@/lib/pizzas";
import Navbar from "@/components/Navbar";
import PizzaCard from "@/components/PizzaCard";

export default function VotarPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = cargando, null = sin sesión
  const [myVotes, setMyVotes] = useState({}); // { local_id: stars }
  const [savingId, setSavingId] = useState(null);
  const [banner, setBanner] = useState(null); // {type:'error'|'success', text}
  const [loadingVotes, setLoadingVotes] = useState(true);

  const totalVotos = Object.keys(myVotes).length;
  const limiteAlcanzado = totalVotos >= 7;

  const cargarMisVotos = useCallback(async (userId) => {
    setLoadingVotes(true);
    const { data, error } = await supabase
      .from("votes")
      .select("local_id, stars")
      .eq("user_id", userId);

    if (!error && data) {
      const mapa = {};
      data.forEach((v) => {
        mapa[v.local_id] = v.stars;
      });
      setMyVotes(mapa);
    }
    setLoadingVotes(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      setSession(data.session);
      cargarMisVotos(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) router.push("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router, cargarMisVotos]);

  async function handleVote(pizza, stars) {
    if (!session) return;
    setBanner(null);

    const yaVotoEsteLocal = myVotes[pizza.id] !== undefined;
    if (!yaVotoEsteLocal && limiteAlcanzado) {
      setBanner({
        type: "error",
        text: "Ya usaste tus 7 votos disponibles.",
      });
      return;
    }

    setSavingId(pizza.id);

    const { error } = await supabase.from("votes").upsert(
      {
        user_id: session.user.id,
        local_id: pizza.id,
        local_name: pizza.localName,
        pizza_name: pizza.pizzaName,
        stars,
      },
      { onConflict: "user_id,local_id" }
    );

    setSavingId(null);

    if (error) {
      setBanner({
        type: "error",
        text: error.message.includes("máximo")
          ? "Ya usaste tus 7 votos disponibles."
          : "No se pudo guardar tu voto. Intenta de nuevo.",
      });
      return;
    }

    setMyVotes((prev) => ({ ...prev, [pizza.id]: stars }));
    setBanner({ type: "success", text: `¡Voto guardado para ${pizza.pizzaName}!` });
  }

  if (session === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm text-smoke">Cargando…</p>
      </main>
    );
  }

  if (!session) return null; // en proceso de redirigir a /login

  return (
    <>
      <Navbar email={session.user.email} isAdmin={isAdminEmail(session.user.email)} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-wide-display text-mozzarella">
              Vota por tu pizza
            </h1>
            <p className="text-sm text-mozzarella/60">
              Un voto por local. Puedes cambiar tu calificación mientras el evento esté abierto.
            </p>
          </div>
          <div className="rounded-full border border-mozzarella/15 px-4 py-2 text-center font-mono text-sm">
            {loadingVotes ? "…" : `${totalVotos} / 7 votos usados`}
          </div>
        </div>

        {banner && (
          <div
            role="status"
            className={`mb-6 rounded-xl px-4 py-3 text-sm ${
              banner.type === "error"
                ? "bg-tomato/10 text-tomato"
                : "bg-basil/10 text-basil"
            }`}
          >
            {banner.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PIZZAS.map((pizza) => {
            const yaVoto = myVotes[pizza.id] !== undefined;
            return (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                myVote={myVotes[pizza.id] || 0}
                saving={savingId === pizza.id}
                votingDisabled={!yaVoto && limiteAlcanzado}
                onVote={handleVote}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}
