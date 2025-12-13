"use client";

import Link from "next/link";
import { Sparkles, TrendingUp, Search, Zap, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Gradient mesh background */}
      <div className="gradient-mesh absolute inset-0 opacity-60" />

      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "-2s" }} />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-fuchsia-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* Floating badge */}
        <div className="animate-float mb-8">
          <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text font-medium text-transparent">
              Potenciado por Inteligencia Artificial
            </span>
          </div>
        </div>

        {/* Hero title */}
        <h1
          className="mb-6 text-center font-[family-name:var(--font-outfit)] text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ lineHeight: "1.1" }}
        >
          <span className="block">El futuro del</span>
          <span className="relative">
            <span className="animate-gradient bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              análisis inteligente
            </span>
            {/* Underline effect */}
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8.5C50 2 100 2 150 5.5C200 9 250 6 298 3"
                stroke="url(#underline-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="0.5" stopColor="#D946EF" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-12 max-w-2xl text-center font-[family-name:var(--font-space-grotesk)] text-lg text-zinc-400 sm:text-xl">
          Descubre patrones ocultos en tus datos con tecnología de vanguardia.
          Análisis predictivo y búsqueda semántica al alcance de un clic.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-8 sm:flex-row">
          {/* Button 1: Análisis técnico de gráficos */}
          <div className="relative">
            {/* AI Badge - fuera del botón para evitar overflow issues */}
            <span className="animate-badge-pulse absolute -right-3 -top-3 z-20 flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-violet-500/50">
              <Zap className="h-3 w-3" />
              IA
            </span>
            <Link
              href="/analisis-tecnico"
              className="shimmer-effect group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-[family-name:var(--font-space-grotesk)] font-semibold text-white backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-violet-500/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] active:scale-100"
            >
              <TrendingUp className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span>Análisis técnico de gráficos</span>

              {/* Hover glow effect */}
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40" />
            </Link>
          </div>

          {/* Button 2: Búsqueda avanzada */}
          <div className="relative">
            {/* AI Badge - fuera del botón para evitar overflow issues */}
            <span className="animate-badge-pulse absolute -right-3 -top-3 z-20 flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-violet-500/50">
              <Zap className="h-3 w-3" />
              IA
            </span>
            <button
              type="button"
              className="shimmer-effect group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-[family-name:var(--font-space-grotesk)] font-semibold text-white backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-violet-500/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] active:scale-100"
            >
              <Search className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:scale-110" />
              <span>Búsqueda avanzada</span>

              {/* Hover glow effect */}
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </div>
        </div>

        {/* Tech stack indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-[family-name:var(--font-space-grotesk)]">Neural Networks</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="font-[family-name:var(--font-space-grotesk)]">Machine Learning</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="h-2 w-2 rounded-full bg-cyan-500" />
            <span className="font-[family-name:var(--font-space-grotesk)]">NLP Processing</span>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </main>

      {/* Footer - Course reference */}
      <footer className="absolute bottom-4 left-0 right-0 z-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <a
            href="https://devexpert.io/cursos/expert/ai"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 text-sm text-zinc-500 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-white/5 hover:text-zinc-300"
          >
            <GraduationCap className="h-4 w-4 text-violet-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-[family-name:var(--font-space-grotesk)]">
              Proyecto del curso{" "}
              <span className="font-medium text-violet-400 transition-colors group-hover:text-violet-300">
                AI Expert
              </span>{" "}
              en DevExpert.io
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
}
