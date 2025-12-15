/**
 * Validadores de formato para API keys
 * Sistema BYOK (Bring Your Own Key)
 */

import type { ApiKeyType, ApiKeyConfig } from '@/types';

/**
 * Configuracion de validacion para cada tipo de API key
 */
export const API_KEY_CONFIG: Record<ApiKeyType, ApiKeyConfig> = {
  gemini: {
    pattern: /^AIza[a-zA-Z0-9_-]{35,}$/,
    helpUrl: 'https://aistudio.google.com/apikey',
    name: 'Google Gemini',
    placeholder: 'AIza...',
  },
  perplexity: {
    pattern: /^pplx-[a-zA-Z0-9]{40,}$/,
    helpUrl: 'https://www.perplexity.ai/settings/api',
    name: 'Perplexity',
    placeholder: 'pplx-...',
  },
};

/**
 * Valida el formato de una API key de Gemini
 */
export function validateGeminiApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  return API_KEY_CONFIG.gemini.pattern.test(key.trim());
}

/**
 * Valida el formato de una API key de Perplexity
 */
export function validatePerplexityApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  return API_KEY_CONFIG.perplexity.pattern.test(key.trim());
}

/**
 * Valida una API key segun su tipo
 */
export function validateApiKey(type: ApiKeyType, key: string): boolean {
  if (type === 'gemini') {
    return validateGeminiApiKey(key);
  }
  return validatePerplexityApiKey(key);
}

/**
 * Obtiene el mensaje de error de validacion para una API key
 */
export function getValidationError(type: ApiKeyType, key: string): string | null {
  if (!key || key.trim().length === 0) {
    return 'La API key no puede estar vacia';
  }

  if (!validateApiKey(type, key)) {
    const config = API_KEY_CONFIG[type];
    return `Formato invalido. La API key de ${config.name} debe comenzar con "${config.placeholder.replace('...', '')}"`;
  }

  return null;
}

/**
 * Enmascara una API key para mostrarla de forma segura
 */
export function maskApiKey(key: string | null): string {
  if (!key || key.length < 10) return '••••••••';
  return `${key.slice(0, 8)}••••••••${key.slice(-4)}`;
}
