import Link from "next/link";
import Image from "next/image";
import { PIZZAS } from "@/lib/pizzas";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-16 text-center">
      {/* Sello circular decorativo, tipo caja de pizza */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-crust/50 text-3xl">
        🍕
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.3em] text-smoke">
        {PIZZAS.length} propuestas · un solo horno gana
      </p>

      <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-wide-display text-mozzarella sm:text-7xl">
        PIZZA FEST<br />
        <span className="text-tomato">MAGANGUÉ</span>
      </h1>

      <p className="mx-auto mt-6 max-w-md text-balance text-mozzarella/70">
        Cada local trajo su mejor receta al horno. Prueba, califica de 1 a 5 estrellas
        y decide qué pizza se corona campeona del festival.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/votar"
          className="rounded-full bg-tomato px-8 py-3 font-semibold text-mozzarella shadow-lg shadow-tomato/20 transition hover:-translate-y-0.5 hover:bg-tomatodark"
        >
          Quiero votar
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-mozzarella/20 px-8 py-3 font-semibold text-mozzarella transition hover:-translate-y-0.5 hover:bg-mozzarella/10"
        >
          Iniciar sesión / Registrarme
        </Link>
      </div>

      <p className="mt-4 text-xs text-smoke">
        Un voto por local · máximo 7 votos por cuenta
      </p>

      {/* Vista previa de las propuestas, como afiche del festival */}
      <section className="mt-20 w-full">
        <h2 className="mb-6 text-left font-display text-2xl tracking-wide-display text-mozzarella/80">
          Las propuestas de este año
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {PIZZAS.map((pizza) => (
            <div
              key={pizza.id}
              className="group relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl border border-mozzarella/10"
            >
              <Image
                src={pizza.image}
                alt={pizza.pizzaName}
                fill
                sizes="160px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-char/95 via-char/20 to-transparent p-3 text-left">
                <span className="font-mono text-[10px] text-crust">
                  {pizza.numero} · {pizza.localName}
                </span>
                <span className="font-display text-sm tracking-wide-display text-mozzarella">
                  {pizza.pizzaName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
