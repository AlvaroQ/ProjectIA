'use client';

/**
 * Cliente de Perplexity API para llamadas directas desde el navegador
 * Sistema BYOK (Bring Your Own Key)
 */

import { API_CONFIG, VALIDATION } from '@/lib/constants';
import type { NewsItem, PerplexityMessage, PerplexityResponse } from '@/types';

// ==========================================
// Prompts
// ==========================================

const SYSTEM_PROMPT = `Eres un especialista en análisis de noticias financieras con acceso a información de mercado en tiempo real. Tu rol es extraer y validar noticias relevantes sobre acciones específicas, priorizando:
1. Fuentes verificadas y reconocidas (Reuters, Bloomberg, Financial Times, AP, etc.)
2. Información factual y contrastada, no especulaciones
3. Impacto en el mercado (relevancia para inversores)
4. Estructura de datos consistente y parseable

Siempre valida que:
- Las URLs sean accesibles y contengan el artículo completo
- Las fechas sean recientes (últimas 72 horas preferentemente)
- Los resúmenes capturen información material, no trivial`;

function buildUserPrompt(ticker: string): string {
  return `Busca y extrae las últimas 5 noticias financieras MÁS RELEVANTES sobre la acción ${ticker}.

CRITERIOS DE BÚSQUEDA:
- Período: último mes
- Relevancia: solo noticias con impacto en precio o decisiones de inversión
- Fuentes: medios financieros reconocidos (Reuters, Bloomberg, CNBC, Financial Times, WSJ, etc.)
- Excluir noticias duplicadas o repetidas

IDIOMA: TODO el contenido debe estar en ESPAÑOL. Traduce los títulos y resúmenes al español.

RESPONDE ÚNICAMENTE CON UN ARRAY JSON VÁLIDO con este formato exacto:
[
  {
    "title": "Título de la noticia EN ESPAÑOL",
    "summary": "Resumen EN ESPAÑOL de máximo 120 palabras explicando QUÉ pasó, POR QUÉ es relevante e IMPACTO esperado",
    "date": "2024-12-14",
    "source": "Nombre del medio",
    "url": "https://ejemplo.com/noticia",
    "impact_level": "HIGH",
    "tags": ["earnings", "acquisition"]
  }
]

REGLAS:
- IMPORTANTE: Títulos y resúmenes SIEMPRE en español
- impact_level debe ser: "HIGH", "MEDIUM" o "LOW"
- tags pueden incluir: earnings, acquisition, regulatory, partnership, product, analyst, lawsuit, ceo, dividend, guidance
- Si no encuentras noticias relevantes, devuelve un array vacío: []
- NO incluyas texto adicional antes o después del JSON
- Solo devuelve el array JSON, nada más`;
}

// ==========================================
// Helpers
// ==========================================

/**
 * Valida el formato del ticker
 */
function validateTicker(ticker: string): { valid: boolean; error?: string; normalized?: string } {
  const trimmed = ticker.trim().toUpperCase();

  if (trimmed.length < VALIDATION.TICKER.MIN_LENGTH) {
    return { valid: false, error: 'El ticker es muy corto' };
  }

  if (trimmed.length > VALIDATION.TICKER.MAX_LENGTH) {
    return { valid: false, error: 'El ticker es muy largo' };
  }

  if (!VALIDATION.TICKER.PATTERN.test(trimmed)) {
    return { valid: false, error: VALIDATION.TICKER.ERROR_MESSAGE };
  }

  return { valid: true, normalized: trimmed };
}

/**
 * Parsea y valida la respuesta de la API
 */
function parseNewsResponse(content: string): NewsItem[] {
  // Limpiar bloques de codigo markdown
  let cleanContent = content.trim();
  cleanContent = cleanContent.replace(/^```json?\s*/i, '');
  cleanContent = cleanContent.replace(/```\s*$/i, '');
  cleanContent = cleanContent.trim();

  // Intentar extraer array JSON
  const jsonArrayMatch = cleanContent.match(/\[[\s\S]*\]/);
  let rawNews: unknown[];

  if (jsonArrayMatch) {
    rawNews = JSON.parse(jsonArrayMatch[0]);
  } else {
    // Intentar como objeto unico
    const singleMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (singleMatch) {
      const parsed = JSON.parse(singleMatch[0]);
      rawNews = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      console.warn('No se encontro JSON en la respuesta de Perplexity');
      return [];
    }
  }

  // Validar y sanitizar items
  return rawNews
    .filter((item): item is Record<string, unknown> => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).title === 'string' &&
        typeof (item as Record<string, unknown>).summary === 'string'
      );
    })
    .map((item) => ({
      title: String(item.title || 'Sin titulo'),
      summary: String(item.summary || 'Sin resumen'),
      date: String(item.date || new Date().toISOString().split('T')[0]),
      source: String(item.source || 'Fuente desconocida'),
      url: String(item.url || '#'),
      impact_level: (
        ['HIGH', 'MEDIUM', 'LOW'].includes(String(item.impact_level))
          ? item.impact_level
          : 'MEDIUM'
      ) as 'HIGH' | 'MEDIUM' | 'LOW',
      tags: Array.isArray(item.tags)
        ? item.tags.filter((t): t is string => typeof t === 'string')
        : [],
    }));
}

// ==========================================
// Cliente Principal
// ==========================================

export interface PerplexitySearchOptions {
  apiKey: string;
  ticker: string;
}

export interface PerplexitySearchResult {
  ticker: string;
  news: NewsItem[];
}

/**
 * Busca noticias financieras usando Perplexity API directamente desde el cliente
 */
export async function searchNewsWithPerplexity({
  apiKey,
  ticker,
}: PerplexitySearchOptions): Promise<PerplexitySearchResult> {
  // Validar ticker
  const tickerValidation = validateTicker(ticker);
  if (!tickerValidation.valid) {
    throw new Error(tickerValidation.error);
  }

  const normalizedTicker = tickerValidation.normalized!;

  // Construir mensajes
  const messages: PerplexityMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildUserPrompt(normalizedTicker) },
  ];

  // Llamar a la API
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    API_CONFIG.PERPLEXITY.TIMEOUT_MS
  );

  let response: Response;
  try {
    response = await fetch(API_CONFIG.PERPLEXITY.URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.PERPLEXITY.MODEL,
        messages,
        temperature: API_CONFIG.PERPLEXITY.TEMPERATURE,
        max_tokens: API_CONFIG.PERPLEXITY.MAX_TOKENS,
        top_p: API_CONFIG.PERPLEXITY.TOP_P,
        search_recency_filter: API_CONFIG.PERPLEXITY.SEARCH_RECENCY,
        web_search_options: {
          search_context_size: API_CONFIG.PERPLEXITY.SEARCH_CONTEXT_SIZE,
        },
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La solicitud tardo demasiado. Intente nuevamente.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  // Manejar errores de la API
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('API Key invalida. Verifica tu configuracion.');
    }
    if (response.status === 429) {
      throw new Error('Demasiadas solicitudes. Espera un momento.');
    }
    throw new Error(`Error de la API de Perplexity: ${response.status}`);
  }

  // Parsear respuesta
  const data: PerplexityResponse = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No se recibio respuesta de la API');
  }

  // Parsear noticias
  const news = parseNewsResponse(content);

  return {
    ticker: normalizedTicker,
    news,
  };
}
