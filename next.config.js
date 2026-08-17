/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Permite imágenes externas (Unsplash de ejemplo y donde subas las fotos reales de las pizzas).
    // Agrega aquí el dominio donde alojes tus propias fotos si no usas Unsplash.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

module.exports = nextConfig;
