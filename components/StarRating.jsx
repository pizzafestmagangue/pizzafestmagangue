"use client";

import { useState } from "react";

/**
 * Estrellas de 1 a 5, interactivas. Muestra "value" (voto ya guardado, si existe)
 * y permite pasar el mouse para previsualizar antes de confirmar con onVote.
 */
export default function StarRating({ value = 0, onVote, disabled = false, saving = false }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label="Calificación de 1 a 5 estrellas"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
            disabled={disabled || saving}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onVote(n)}
            className={`text-2xl leading-none transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 ${
              n <= shown ? "text-crust" : "text-smoke/40"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {saving && (
        <span className="text-xs text-smoke font-mono animate-pulse">guardando…</span>
      )}
      {!saving && value > 0 && (
        <span className="text-xs text-basil font-mono">tu voto: {value}★</span>
      )}
    </div>
  );
}
