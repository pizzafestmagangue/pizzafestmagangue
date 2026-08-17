"use client";

import Image from "next/image";
import StarRating from "./StarRating";

export default function PizzaCard({ pizza, myVote, saving, onVote, votingDisabled }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-mozzarella/10 bg-char shadow-lg shadow-black/30">
      {/* Sello numerado, tipo caja de pizza */}
      <div className="absolute left-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-mozzarella/70 bg-oven/80 font-display text-lg text-mozzarella backdrop-blur">
        {pizza.numero}
      </div>

      {myVote > 0 && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-basil px-3 py-1 text-xs font-semibold text-mozzarella shadow">
          Ya votaste
        </div>
      )}

      <div className="relative h-48 w-full">
        <Image
          src={pizza.image}
          alt={`${pizza.pizzaName} — ${pizza.localName}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-char via-char/10 to-transparent" />
      </div>

      <div className="space-y-2 p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-smoke">
          {pizza.localName}
        </p>
        <h3 className="font-display text-2xl leading-none tracking-wide-display text-mozzarella">
          {pizza.pizzaName}
        </h3>
        <p className="text-sm leading-snug text-mozzarella/70">{pizza.ingredients}</p>

        <div className="pt-2">
          <StarRating
            value={myVote}
            saving={saving}
            disabled={votingDisabled}
            onVote={(n) => onVote(pizza, n)}
          />
        </div>
      </div>
    </article>
  );
}
