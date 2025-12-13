import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ProjectIA - Inteligencia Artificial Avanzada",
  description: "Análisis técnico de gráficos y búsqueda avanzada potenciados por IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} antialiased`}
      >
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
