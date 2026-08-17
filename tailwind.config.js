/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "horno de leña": fondo carbón, costra dorada, salsa de tomate, albahaca.
        oven: "#1B1410",
        char: "#120D0A",
        crust: "#E8C468",
        tomato: "#C1432A",
        tomatodark: "#8F2E1C",
        basil: "#4C7A5A",
        mozzarella: "#FBF6E9",
        smoke: "#8A7A6B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(251,246,233,0.04) 1px, transparent 0)",
      },
      backgroundSize: {
        "grain": "22px 22px",
      },
    },
  },
  plugins: [],
};
