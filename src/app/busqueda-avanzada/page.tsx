"use client";

import * as React from "react";
import {
  Loader2,
  Search,
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Calendar,
  Building2,
  Tag,
  AlertCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader, LoadingSpinner, EmptyState, ApiKeyRequired } from "@/components/shared";
import { useNewsSearch } from "@/hooks";
import { UI_MESSAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { NewsItem, ImpactLevel } from "@/types";

// ==========================================
// Componentes locales de la pagina
// ==========================================

const ImpactBadge = ({ level }: { level: ImpactLevel }) => {
  const config = {
    HIGH: {
      icon: TrendingUp,
      label: "Alto Impacto",
      className: "bg-red-500/20 text-red-400 border-red-500/30",
      glow: "shadow-red-500/20",
    },
    MEDIUM: {
      icon: Minus,
      label: "Impacto Medio",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      glow: "shadow-amber-500/20",
    },
    LOW: {
      icon: TrendingDown,
      label: "Bajo Impacto",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      glow: "shadow-emerald-500/20",
    },
  };

  const { icon: Icon, label, className, glow } = config[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-lg",
        className,
        glow
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const NewsCard = ({ news, index }: { news: NewsItem; index: number }) => {
  return (
    <div
      className="group relative glass rounded-2xl border border-zinc-800/50 overflow-hidden transition-all duration-500 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <ImpactBadge level={news.impact_level} />
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            {news.date}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-violet-200 transition-colors duration-300">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-zinc-400 leading-relaxed">{news.summary}</p>

        {/* Tags */}
        {news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {news.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/50 text-zinc-400 text-xs border border-zinc-700/50"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Building2 className="h-4 w-4" />
            <span>{news.source}</span>
          </div>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-400 text-sm font-medium border border-violet-500/30 hover:bg-violet-600/30 hover:text-violet-300 transition-all duration-300"
          >
            Ver noticia
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Componente principal
// ==========================================

export default function BusquedaAvanzadaPage() {
  const [tickerInput, setTickerInput] = React.useState("");
  const { news, ticker, isLoading, error, hasSearched, search } = useNewsSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tickerInput.trim()) {
      toast.error(UI_MESSAGES.ERROR.TICKER_REQUIRED);
      return;
    }

    await search(tickerInput);

    if (!error && news.length > 0) {
      toast.success(UI_MESSAGES.SUCCESS.SEARCH(news.length, ticker || tickerInput));
    }
  };

  // Mostrar error como toast
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch(e);
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <LoadingSpinner
          icon={Search}
          title={UI_MESSAGES.LOADING.SEARCH}
          subtitle={UI_MESSAGES.LOADING.SEARCH_SUBTITLE}
        />
      );
    }

    if (!hasSearched) {
      return (
        <EmptyState
          icon={Newspaper}
          title={UI_MESSAGES.EMPTY.SEARCH_TITLE}
          subtitle={UI_MESSAGES.EMPTY.SEARCH_SUBTITLE}
        />
      );
    }

    if (news.length === 0) {
      return (
        <EmptyState
          icon={AlertCircle}
          title={UI_MESSAGES.EMPTY.NO_RESULTS_TITLE}
          subtitle={UI_MESSAGES.EMPTY.NO_RESULTS_SUBTITLE}
          colorTheme="amber"
        />
      );
    }

    return (
      <div className="space-y-4">
        {/* Results header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-violet-600/20 text-violet-400 text-sm font-bold border border-violet-500/30">
              {ticker}
            </span>
            <span className="text-sm text-zinc-500">
              {news.length} noticia{news.length !== 1 ? "s" : ""} encontrada{news.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* News cards */}
        <div className="grid gap-4">
          {news.map((newsItem, index) => (
            <NewsCard key={index} news={newsItem} index={index} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="gradient-mesh absolute inset-0 opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-blob" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px] animate-blob"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-blob"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      {/* Header */}
      <PageHeader
        backHref="/"
        icon={Search}
        title="Busqueda Avanzada"
        subtitle="Noticias financieras con Perplexity AI"
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <ApiKeyRequired type="perplexity">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Card */}
          <Card className="glass border-zinc-800/50 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-sm font-bold">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">
                    Buscar Noticias por Ticker
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Introduce el simbolo de una accion para obtener noticias relevantes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticker" className="text-zinc-300 text-sm">
                    Ticker / Simbolo
                  </Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="ticker"
                        type="text"
                        value={tickerInput}
                        onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        placeholder="Ej: AAPL, TSLA, NVDA..."
                        className="h-12 bg-zinc-900/50 border-zinc-700/50 text-white placeholder:text-zinc-500 text-lg font-medium tracking-wider uppercase focus:border-violet-500/50 focus:ring-violet-500/20 transition-all duration-300"
                        disabled={isLoading}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
                        <Search className="h-5 w-5" />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !tickerInput.trim()}
                      size="lg"
                      className={cn(
                        "relative overflow-hidden h-12 px-8 text-base font-semibold rounded-xl",
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
                          Buscando
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Tips */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                  <AlertCircle className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-violet-200/80">
                    La busqueda extrae las 5 noticias financieras mas relevantes del ultimo mes, priorizando fuentes como Reuters, Bloomberg y Financial Times.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="glass border-zinc-800/50 overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-sm font-bold">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">
                    Resultados
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Noticias financieras ordenadas por relevancia e impacto
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {renderResults()}
            </CardContent>
          </Card>
        </div>
        </ApiKeyRequired>
      </main>
    </div>
  );
}
