'use client';

/**
 * Context para manejar API keys del usuario
 * Sistema BYOK (Bring Your Own Key)
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  getApiKey,
  saveApiKey,
  removeApiKey,
  clearAllApiKeys,
} from '@/lib/api-keys-storage';
import type { ApiKeysContextValue } from '@/types';

const ApiKeysContext = createContext<ApiKeysContextValue | null>(null);

interface ApiKeysProviderProps {
  children: ReactNode;
}

export function ApiKeysProvider({ children }: ApiKeysProviderProps) {
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(null);
  const [perplexityApiKey, setPerplexityApiKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar keys de localStorage al montar
  useEffect(() => {
    setGeminiApiKeyState(getApiKey('gemini'));
    setPerplexityApiKeyState(getApiKey('perplexity'));
    setIsLoading(false);
  }, []);

  const setGeminiApiKey = useCallback((key: string | null) => {
    if (key) {
      saveApiKey('gemini', key);
      setGeminiApiKeyState(key);
    } else {
      removeApiKey('gemini');
      setGeminiApiKeyState(null);
    }
  }, []);

  const setPerplexityApiKey = useCallback((key: string | null) => {
    if (key) {
      saveApiKey('perplexity', key);
      setPerplexityApiKeyState(key);
    } else {
      removeApiKey('perplexity');
      setPerplexityApiKeyState(null);
    }
  }, []);

  const handleClearAllKeys = useCallback(() => {
    clearAllApiKeys();
    setGeminiApiKeyState(null);
    setPerplexityApiKeyState(null);
  }, []);

  const value: ApiKeysContextValue = {
    geminiApiKey,
    perplexityApiKey,
    setGeminiApiKey,
    setPerplexityApiKey,
    clearAllKeys: handleClearAllKeys,
    hasGeminiKey: geminiApiKey !== null && geminiApiKey.length > 0,
    hasPerplexityKey: perplexityApiKey !== null && perplexityApiKey.length > 0,
    isLoading,
  };

  return (
    <ApiKeysContext.Provider value={value}>
      {children}
    </ApiKeysContext.Provider>
  );
}

export function useApiKeys(): ApiKeysContextValue {
  const context = useContext(ApiKeysContext);
  if (!context) {
    throw new Error('useApiKeys must be used within ApiKeysProvider');
  }
  return context;
}
