'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { KeyRound, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiKeys } from '@/context';
import type { ApiKeyType } from '@/types';
import { API_KEY_CONFIG } from '@/lib/api-keys-validation';

interface ApiKeyRequiredProps {
  type: ApiKeyType;
  children: ReactNode;
}

export function ApiKeyRequired({ type, children }: ApiKeyRequiredProps) {
  const { hasGeminiKey, hasPerplexityKey, isLoading } = useApiKeys();

  const hasKey = type === 'gemini' ? hasGeminiKey : hasPerplexityKey;
  const config = API_KEY_CONFIG[type];

  // Mostrar loading mientras se cargan las keys
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-neutral-400">Cargando...</div>
      </div>
    );
  }

  // Si tiene la key, renderizar children
  if (hasKey) {
    return <>{children}</>;
  }

  // Si no tiene la key, mostrar mensaje
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
          <KeyRound className="h-8 w-8 text-amber-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-100">
            API Key Requerida
          </h2>
          <p className="text-neutral-400">
            Para usar esta funcionalidad, necesitas configurar tu API key de{' '}
            <span className="text-neutral-200 font-medium">{config.name}</span>.
          </p>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-left">
          <h3 className="text-sm font-medium text-neutral-200 mb-2">
            Como obtener tu API key:
          </h3>
          <ol className="text-sm text-neutral-400 space-y-1 list-decimal list-inside">
            <li>
              Visita{' '}
              <a
                href={config.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {config.helpUrl.replace('https://', '')}
              </a>
            </li>
            <li>Crea una cuenta o inicia sesion</li>
            <li>Genera una nueva API key</li>
            <li>Copia la key y configurala en esta aplicacion</li>
          </ol>
        </div>

        <Link href="/configuracion">
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Ir a Configuracion
          </Button>
        </Link>

        <p className="text-xs text-neutral-500">
          Tu API key se guarda localmente en tu navegador y nunca se envia a nuestros servidores.
        </p>
      </div>
    </div>
  );
}
