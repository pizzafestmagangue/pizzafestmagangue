import { Bebas_Neue, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Pizza Fest Magangué",
  description:
    "Pizza Fest Magangué · varias propuestas, un solo horno gana. Vota por tu pizza favorita.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-oven text-mozzarella bg-grain bg-[length:22px_22px] min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
