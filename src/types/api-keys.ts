/**
 * Tipos para el sistema BYOK (Bring Your Own Key)
 */

export interface ApiKeys {
  geminiApiKey: string | null;
  perplexityApiKey: string | null;
}

export interface ApiKeysContextValue extends ApiKeys {
  setGeminiApiKey: (key: string | null) => void;
  setPerplexityApiKey: (key: string | null) => void;
  clearAllKeys: () => void;
  hasGeminiKey: boolean;
  hasPerplexityKey: boolean;
  isLoading: boolean;
}

export type ApiKeyType = 'gemini' | 'perplexity';

export interface ApiKeyConfig {
  pattern: RegExp;
  helpUrl: string;
  name: string;
  placeholder: string;
}
