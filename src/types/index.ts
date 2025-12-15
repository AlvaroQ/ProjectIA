/**
 * Tipos centralizados para la aplicacion
 * Evita duplicacion de tipos entre archivos
 */

// Re-exportar tipos de API Keys (BYOK)
export * from './api-keys';

// ==========================================
// Tipos de Noticias / Busqueda
// ==========================================

/**
 * Nivel de impacto de una noticia financiera
 */
export type ImpactLevel = "HIGH" | "MEDIUM" | "LOW";

/**
 * Item de noticia financiera
 */
export interface NewsItem {
  /** Titulo de la noticia (en espanol) */
  title: string;
  /** Resumen de la noticia */
  summary: string;
  /** Fecha de publicacion (YYYY-MM-DD) */
  date: string;
  /** Fuente de la noticia */
  source: string;
  /** URL de la noticia original */
  url: string;
  /** Nivel de impacto en el mercado */
  impact_level: ImpactLevel;
  /** Tags/categorias de la noticia */
  tags: string[];
}

/**
 * Respuesta de la API de busqueda
 */
export interface SearchResponse {
  /** Ticker buscado (normalizado a mayusculas) */
  ticker: string;
  /** Lista de noticias encontradas */
  news: NewsItem[];
  /** Uso de tokens de la API (opcional) */
  usage?: TokenUsage;
  /** Error si la busqueda fallo */
  error?: string;
}

// ==========================================
// Tipos de Perplexity API
// ==========================================

/**
 * Mensaje para la API de Perplexity
 */
export interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Uso de tokens en la respuesta de Perplexity
 */
export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Respuesta de la API de Perplexity
 */
export interface PerplexityResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: TokenUsage;
}

// ==========================================
// Tipos de API Response
// ==========================================

/**
 * Respuesta de error estandarizada de la API
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Respuesta exitosa generica de la API
 */
export interface ApiSuccessResponse<T> {
  data: T;
  meta?: {
    cached?: boolean;
    timestamp?: string;
  };
}

// ==========================================
// Tipos de Analisis Tecnico
// ==========================================

/**
 * Tendencias por plazo temporal
 */
export interface TrendsByTimeframe {
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
}

/**
 * Nivel de soporte/resistencia
 */
export interface PriceLevel {
  level: string;
  reason: string;
}

/**
 * Indicador RSI
 */
export interface RsiIndicator {
  value: number;
  isVisible: boolean;
}

/**
 * Indicador MACD
 */
export interface MacdIndicator {
  status: string;
  comment: string;
  isVisible: boolean;
}
