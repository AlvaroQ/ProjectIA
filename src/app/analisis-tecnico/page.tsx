"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import {
  Loader2,
  UploadCloud,
  ClipboardPaste,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  GanttChartSquare,
  CandlestickChart,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Target,
  Shield,
  Zap,
  Activity
} from "lucide-react"
import { toast } from "sonner"
import { useTechnicalAnalysis } from "@/hooks"
import { ApiKeyRequired } from "@/components/shared"
import { cn } from "@/lib/utils"
import type { TechnicalAnalysisOutput } from "@/services/gemini-client"

// ============================================
// COMPONENTES DE VISUALIZACION PREMIUM
// ============================================

const RsiGauge = ({ value }: { value: number }) => {
  const rotation = (value / 100) * 180;
  const status = value > 70 ? "Sobrecompra" : value < 30 ? "Sobreventa" : "Neutral";
  const colorClass = value > 70 ? "text-red-400" : value < 30 ? "text-amber-400" : "text-emerald-400";
  const glowColor = value > 70 ? "rgba(248, 113, 113, 0.5)" : value < 30 ? "rgba(251, 191, 36, 0.5)" : "rgba(52, 211, 153, 0.5)";

  return (
    <div className="relative flex flex-col items-center justify-center p-6 h-full">
      {/* Gauge Container */}
      <div className="relative w-52 h-28">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background track */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom transition-transform duration-1000 ease-out"
          style={{
            transform: `translateX(-50%) rotate(${rotation - 90}deg)`,
            background: `linear-gradient(to top, white, ${glowColor})`
          }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
               style={{ boxShadow: `0 0 10px ${glowColor}` }} />
        </div>
      </div>

      {/* Value Display */}
      <div className="mt-6 text-center">
        <div className="text-4xl font-bold text-white font-[family-name:var(--font-outfit)]"
             style={{ textShadow: `0 0 20px ${glowColor}` }}>
          {value.toFixed(1)}
        </div>
        <div className={cn("text-lg font-semibold mt-1", colorClass)}>{status}</div>
      </div>

    </div>
  );
};

const MacdIndicator = ({ status, comment, isVisible }: { status: string, comment: string, isVisible: boolean }) => {
  const lowerStatus = status.toLowerCase();
  const isAlcista = lowerStatus.includes("alcista");
  const isBajista = lowerStatus.includes("bajista");

  const Icon = isAlcista ? TrendingUp : isBajista ? TrendingDown : Minus;
  const colorClass = isAlcista ? "text-emerald-400" : isBajista ? "text-red-400" : "text-zinc-400";
  const borderColor = isAlcista ? "border-emerald-500/30" : isBajista ? "border-red-500/30" : "border-zinc-700/50";
  const bgGradient = isAlcista
    ? "from-emerald-500/10 via-emerald-500/5 to-transparent"
    : isBajista
    ? "from-red-500/10 via-red-500/5 to-transparent"
    : "from-zinc-500/10 via-zinc-500/5 to-transparent";
  const glowColor = isAlcista ? "rgba(52, 211, 153, 0.3)" : isBajista ? "rgba(248, 113, 113, 0.3)" : "transparent";
  const titleColor = isAlcista ? "text-emerald-300" : isBajista ? "text-red-300" : "text-white";

  return (
    <div className={cn(
      "glass rounded-2xl border overflow-hidden h-full",
      borderColor,
      "bg-gradient-to-b", bgGradient
    )}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <h3 className={cn("text-base font-semibold", titleColor)}>Indicador MACD</h3>
          {!isVisible && (
            <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
              <AlertCircle className="h-3 w-3" />
              No visible
            </span>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <div
          className={cn("p-4 rounded-full bg-zinc-800/50 border border-zinc-700/50", colorClass)}
          style={{ boxShadow: `0 0 30px ${glowColor}` }}
        >
          <Icon className="h-12 w-12" />
        </div>
        <div className="text-center">
          <p className={cn("text-xl font-bold", colorClass)}>{status}</p>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function TechnicalAnalysisPage() {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { result: analysisResult, isLoading, error, analyze, reset: resetAnalysis } = useTechnicalAnalysis()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande. El limite es 4MB.")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      resetAnalysis()
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = React.useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if(file){
          processFile(file);
          toast.success("Imagen pegada correctamente desde el portapapeles.")
        }
        break;
      }
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleAnalyzeClick = async () => {
    if (!imagePreview) {
      toast.error("Por favor, sube una imagen primero.")
      return
    }
    await analyze(imagePreview)
  }

  // Mostrar toast de éxito o error
  React.useEffect(() => {
    if (analysisResult) {
      toast.success("Analisis completado exitosamente")
    }
  }, [analysisResult])

  React.useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleReset = () => {
    setImagePreview(null);
    resetAnalysis();
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // ============================================
  // RENDER DE CONTENIDO DE ANALISIS
  // ============================================

  const renderAnalysisContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-16">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl animate-pulse" />
            <div className="relative p-6 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30">
              <BrainCircuit className="h-12 w-12 text-violet-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">Analizando con IA...</p>
            <p className="text-sm text-zinc-400">Identificando patrones, tendencias e indicadores</p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (!analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-zinc-500/10 blur-xl" />
            <div className="relative p-6 rounded-full bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50">
              <UploadCloud className="h-12 w-12 text-zinc-500" />
            </div>
          </div>
          <p className="text-lg font-semibold text-zinc-300 mb-2">Esperando imagen</p>
          <p className="text-sm text-zinc-500 max-w-xs">
            Sube o pega un grafico de velas para que la IA lo analice
          </p>
        </div>
      );
    }

    const { analysis, summary, indicators } = analysisResult;

    return (
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl gap-1">
          <TabsTrigger
            value="analysis"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 transition-all duration-300"
          >
            <Activity className="w-4 h-4 mr-2" />
            Analisis
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 transition-all duration-300"
          >
            <Target className="w-4 h-4 mr-2" />
            Niveles
          </TabsTrigger>
          <TabsTrigger
            value="indicators"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 transition-all duration-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            Indicadores
          </TabsTrigger>
        </TabsList>

        {/* TAB: Analisis Detallado */}
        <TabsContent value="analysis" className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Tendencia General */}
          <div className="group glass rounded-2xl p-5 border border-zinc-800/50 hover:border-violet-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-2">Tendencia General</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{analysis.generalTrend}</p>
              </div>
            </div>
          </div>

          {/* Patrones */}
          <div className="group glass rounded-2xl p-5 border border-zinc-800/50 hover:border-violet-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                <CandlestickChart className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-2">Patrones Identificados</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{analysis.patterns}</p>
              </div>
            </div>
          </div>

          {/* Señales */}
          <div className="group glass rounded-2xl p-5 border border-zinc-800/50 hover:border-violet-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <GanttChartSquare className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-2">Señales Tecnicas</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{analysis.signals}</p>
              </div>
            </div>
          </div>

          {/* Conclusion - Destacada */}
          <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent border border-violet-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="relative flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 border border-violet-400/30">
                <Sparkles className="h-5 w-5 text-violet-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-violet-200 mb-2">Conclusion del Analisis</h3>
                <p className="text-sm text-violet-100/90 leading-relaxed font-medium">{analysis.conclusion}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB: Resumen y Niveles */}
        <TabsContent value="summary" className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Tendencias por plazo */}
          <div className="glass rounded-2xl p-5 border border-zinc-800/50">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-violet-400" />
              Tendencias por Plazo
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Corto", value: summary.trends.shortTerm },
                { label: "Medio", value: summary.trends.mediumTerm },
                { label: "Largo", value: summary.trends.longTerm },
              ].map((trend, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{trend.label}</p>
                  <p className="text-sm font-semibold text-zinc-200">{trend.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Soportes y Resistencias */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Soportes */}
            <div className="glass rounded-2xl p-5 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                Soportes Clave
              </h3>
              <div className="space-y-3">
                {summary.supports.map((s, i) => (
                  <div key={`s-${i}`} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold whitespace-nowrap">
                      {s.level}
                    </span>
                    <span className="text-sm text-zinc-300">{s.reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resistencias */}
            <div className="glass rounded-2xl p-5 border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-red-400" />
                Resistencias Clave
              </h3>
              <div className="space-y-3">
                {summary.resistances.map((r, i) => (
                  <div key={`r-${i}`} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-bold whitespace-nowrap">
                      {r.level}
                    </span>
                    <span className="text-sm text-zinc-300">{r.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB: Indicadores */}
        <TabsContent value="indicators" className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-2 gap-4">
            {/* RSI */}
            <div className="glass rounded-2xl border border-zinc-800/50 overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">Indicador RSI</h3>
                  {!indicators.rsi.isVisible && (
                    <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                      <AlertCircle className="h-3 w-3" />
                      Estimado
                    </span>
                  )}
                </div>
              </div>
              <RsiGauge value={indicators.rsi.value} />
            </div>

            {/* MACD */}
            <MacdIndicator
              status={indicators.macd.status}
              comment={indicators.macd.comment}
              isVisible={indicators.macd.isVisible}
            />
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0f] flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="gradient-mesh absolute inset-0 opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px] animate-blob" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Header Premium */}
      <header className="relative z-10 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-zinc-700/50 group-hover:border-zinc-600/50 transition-all duration-300">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline">Volver</span>
            </Link>
            <div className="h-6 w-px bg-zinc-800" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30">
                <BrainCircuit className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-[family-name:var(--font-outfit)]">
                  Analisis Tecnico
                </h1>
                <p className="text-xs text-zinc-500 hidden sm:block">Potenciado por Gemini 2.0 Flash</p>
              </div>
            </div>
          </div>

          {/* Badge AI */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">IA Activa</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto p-4 md:p-6 lg:p-8 overflow-hidden">
        <ApiKeyRequired type="gemini">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">

          {/* ==================== */}
          {/* COLUMNA IZQUIERDA - UPLOAD */}
          {/* ==================== */}
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Card de Upload */}
            <Card className="glass border-zinc-800/50 overflow-hidden flex-1 flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Sube tu Grafico</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      Formatos: JPG, PNG (max. 4MB)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {/* File Input */}
                <div className="space-y-2">
                  <Label htmlFor="chart-image" className="text-zinc-300 text-sm">
                    Selecciona una imagen
                  </Label>
                  <Input
                    id="chart-image"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="bg-zinc-900/50 border-zinc-700/50 text-zinc-300
                               file:bg-gradient-to-r file:from-violet-600 file:to-fuchsia-600
                               file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4
                               file:font-medium file:text-sm file:cursor-pointer
                               hover:file:from-violet-500 hover:file:to-fuchsia-500
                               transition-all duration-300"
                  />
                </div>

                {/* Paste Area */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center gap-3 p-6 border-2 border-dashed border-zinc-700/50 rounded-xl bg-zinc-900/30 group-hover:border-violet-500/50 transition-all duration-300 cursor-pointer">
                    <ClipboardPaste className="h-6 w-6 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                    <div className="text-center">
                      <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        O pega una imagen
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">Ctrl + V</p>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-700/50 bg-zinc-900/50 animate-in fade-in zoom-in-95 duration-300">
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30">
                        Listo para analizar
                      </span>
                    </div>
                    <Image
                      src={imagePreview}
                      alt="Vista previa del grafico"
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                {/* Tip */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-200/80">
                    Para mejores resultados, incluye indicadores RSI y MACD visibles en el grafico
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Botones de Accion */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Button
                onClick={handleAnalyzeClick}
                disabled={!imagePreview || isLoading}
                size="lg"
                className={cn(
                  "relative overflow-hidden h-14 text-base font-semibold rounded-xl",
                  "bg-gradient-to-r from-violet-600 to-fuchsia-600",
                  "hover:from-violet-500 hover:to-fuchsia-500",
                  "disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500",
                  "transition-all duration-300",
                  "shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
                  "shimmer-effect"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-5 w-5" />
                    Analizar con IA
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-11 rounded-xl border-zinc-700/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 hover:border-zinc-600/50 transition-all duration-300"
                disabled={isLoading}
              >
                Reiniciar
              </Button>
            </div>
          </div>

          {/* ==================== */}
          {/* COLUMNA DERECHA - RESULTADOS */}
          {/* ==================== */}
          <Card className="flex flex-col glass border-zinc-800/50 overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-800/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Resultados del Analisis</CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Tendencias, patrones e indicadores
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-4 custom-scrollbar min-h-0">
              {renderAnalysisContent()}
            </CardContent>
          </Card>
        </div>
        </ApiKeyRequired>
      </main>
    </div>
  );
}
