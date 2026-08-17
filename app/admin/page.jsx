"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase, isAdminEmail } from "@/lib/supabaseClient";
import { PIZZAS } from "@/lib/pizzas";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [rows, setRows] = useState([]); // filas crudas de votes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);

  const cargarVotos = useCallback(async () => {
    const { data, error: err } = await supabase.from("votes").select("local_id, stars");
    if (err) {
      setError(
        "No se pudieron cargar los votos. Verifica que tu correo esté en la política " +
          "'admin ve todos los votos' dentro de sql/schema.sql."
      );
      setRows([]);
    } else {
      setError("");
      setRows(data || []);
      setLastUpdate(new Date());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      if (!isAdminEmail(data.session.user.email)) {
        router.push("/votar");
        return;
      }
      setSession(data.session);
      cargarVotos();
    });
  }, [router, cargarVotos]);

  // Suscripción en tiempo real: cualquier cambio en la tabla recalcula todo al instante.
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("votes-realtime-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes" },
        () => {
          cargarVotos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, cargarVotos]);

  const resumen = useMemo(() => {
    const porLocal = {};
    PIZZAS.forEach((p) => {
      porLocal[p.id] = { pizza: p, votos: 0, sumaEstrellas: 0 };
    });
    rows.forEach((r) => {
      if (!porLocal[r.local_id]) return;
      porLocal[r.local_id].votos += 1;
      porLocal[r.local_id].sumaEstrellas += r.stars;
    });

    const lista = Object.values(porLocal).map((item) => ({
      ...item,
      promedio: item.votos > 0 ? item.sumaEstrellas / item.votos : 0,
    }));

    // Orden: primero por total de estrellas acumuladas (lo que va "sumando" el evento),
    // como desempate, el promedio.
    lista.sort((a, b) => b.sumaEstrellas - a.sumaEstrellas || b.promedio - a.promedio);
    return lista;
  }, [rows]);

  const ganador = resumen[0]?.votos > 0 ? resumen[0] : null;
  const totalVotosGlobal = rows.length;

  if (session === undefined || (session && loading)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm text-smoke">Cargando panel…</p>
      </main>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar email={session.user.email} isAdmin={true} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-wide-display text-mozzarella">
              Panel de administrador
            </h1>
            <p className="text-sm text-mozzarella/60">
              {totalVotosGlobal} votos registrados en total · en vivo
            </p>
          </div>
          {lastUpdate && (
            <p className="font-mono text-xs text-smoke">
              actualizado {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-tomato/10 px-4 py-3 text-sm text-tomato">
            {error}
          </div>
        )}

        {/* Ganador actual, destacado */}
        {ganador ? (
          <div className="mb-8 flex flex-col overflow-hidden rounded-2xl border border-crust/40 bg-char sm:flex-row">
            <div className="relative h-48 w-full sm:h-auto sm:w-64">
              <Image
                src={ganador.pizza.image}
                alt={ganador.pizza.pizzaName}
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-crust">
                👑 Ganador en este momento
              </p>
              <h2 className="font-display text-4xl tracking-wide-display text-mozzarella">
                {ganador.pizza.pizzaName}
              </h2>
              <p className="text-mozzarella/60">{ganador.pizza.localName}</p>
              <div className="mt-2 flex gap-6 font-mono text-sm">
                <span>
                  <span className="text-crust">{ganador.sumaEstrellas}</span> estrellas
                  acumuladas
                </span>
                <span>
                  <span className="text-crust">{ganador.votos}</span> votos
                </span>
                <span>
                  <span className="text-crust">{ganador.promedio.toFixed(2)}</span> promedio
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-mozzarella/10 bg-char p-6 text-center text-mozzarella/50">
            Aún no hay votos registrados.
          </div>
        )}

        {/* Tabla completa, ordenada de mayor a menor */}
        <div className="overflow-x-auto rounded-2xl border border-mozzarella/10">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-mozzarella/10 bg-char text-left font-mono text-xs uppercase tracking-widest text-smoke">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Local / Pizza</th>
                <th className="px-4 py-3 text-right">Votos</th>
                <th className="px-4 py-3 text-right">Estrellas totales</th>
                <th className="px-4 py-3 text-right">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {resumen.map((item, i) => (
                <tr
                  key={item.pizza.id}
                  className={`border-b border-mozzarella/5 ${
                    i === 0 && item.votos > 0 ? "bg-crust/5" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-smoke">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-mozzarella">{item.pizza.pizzaName}</p>
                    <p className="text-xs text-mozzarella/50">{item.pizza.localName}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{item.votos}</td>
                  <td className="px-4 py-3 text-right font-mono">{item.sumaEstrellas}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {item.promedio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-smoke">
          Esta información solo es visible para cuentas administradoras definidas en
          NEXT_PUBLIC_ADMIN_EMAILS y protegidas además por la política de Supabase.
        </p>
      </main>
    </>
  );
}
