"use client";

import { useState, useCallback } from "react";
import { searchNewsWithPerplexity } from "@/services/perplexity-client";
import { useApiKeys } from "@/context";
import type { NewsItem } from "@/types";

/**
 * Estado del hook de busqueda de noticias
 */
interface UseNewsSearchState {
  /** Lista de noticias encontradas */
  news: NewsItem[];
  /** Ticker buscado (normalizado) */
  ticker: string | null;
  /** Indica si hay una busqueda en progreso */
  isLoading: boolean;
  /** Mensaje de error si la busqueda fallo */
  error: string | null;
  /** Indica si se ha realizado alguna busqueda */
  hasSearched: boolean;
}

/**
 * Retorno del hook de busqueda de noticias
 */
interface UseNewsSearchReturn extends UseNewsSearchState {
  /** Ejecuta una busqueda con el ticker dado */
  search: (ticker: string) => Promise<void>;
  /** Resetea el estado del hook */
  reset: () => void;
  /** Indica si la API key esta configurada */
  hasApiKey: boolean;
}

/**
 * Hook personalizado para busqueda de noticias financieras
 *
 * Utiliza el sistema BYOK (Bring Your Own Key) para llamar
 * directamente a la API de Perplexity desde el cliente.
 *
 * @example
 * ```tsx
 * function SearchPage() {
 *   const { news, isLoading, error, search, reset, hasApiKey } = useNewsSearch();
 *
 *   if (!hasApiKey) return <ConfigureApiKey />;
 *
 *   const handleSearch = (ticker: string) => {
 *     search(ticker);
 *   };
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error} />;
 *   return <NewsList news={news} />;
 * }
 * ```
 */
export function useNewsSearch(): UseNewsSearchReturn {
  const { perplexityApiKey, hasPerplexityKey } = useApiKeys();

  const [state, setState] = useState<UseNewsSearchState>({
    news: [],
    ticker: null,
    isLoading: false,
    error: null,
    hasSearched: false,
  });

  /**
   * Ejecuta una busqueda de noticias
   */
  const search = useCallback(async (tickerInput: string) => {
    const trimmedTicker = tickerInput.trim();

    if (!trimmedTicker) {
      setState((prev) => ({
        ...prev,
        error: "Por favor, introduce un ticker para buscar",
      }));
      return;
    }

    // Verificar que la API key este configurada
    if (!hasPerplexityKey || !perplexityApiKey) {
      setState((prev) => ({
        ...prev,
        error: "API Key de Perplexity no configurada. Ve a Configuracion para agregarla.",
      }));
      return;
    }

    // Iniciar busqueda
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      hasSearched: true,
    }));

    try {
      const result = await searchNewsWithPerplexity({
        apiKey: perplexityApiKey,
        ticker: trimmedTicker,
      });

      // Busqueda exitosa
      setState((prev) => ({
        ...prev,
        news: result.news,
        ticker: result.ticker,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      // Error en la busqueda
      setState((prev) => ({
        ...prev,
        news: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }));
    }
  }, [perplexityApiKey, hasPerplexityKey]);

  /**
   * Resetea el estado del hook
   */
  const reset = useCallback(() => {
    setState({
      news: [],
      ticker: null,
      isLoading: false,
      error: null,
      hasSearched: false,
    });
  }, []);

  return {
    ...state,
    search,
    reset,
    hasApiKey: hasPerplexityKey,
  };
}
