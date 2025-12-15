'use client';

import { Settings, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, ApiKeyInput } from '@/components/shared';
import { useApiKeys } from '@/context';

export default function ConfiguracionPage() {
  const {
    geminiApiKey,
    perplexityApiKey,
    setGeminiApiKey,
    setPerplexityApiKey,
    clearAllKeys,
    hasGeminiKey,
    hasPerplexityKey,
  } = useApiKeys();

  const handleSaveGemini = (key: string) => {
    setGeminiApiKey(key);
    toast.success('API Key de Gemini guardada correctamente');
  };

  const handleSavePerplexity = (key: string) => {
    setPerplexityApiKey(key);
    toast.success('API Key de Perplexity guardada correctamente');
  };

  const handleClearGemini = () => {
    setGeminiApiKey(null);
    toast.info('API Key de Gemini eliminada');
  };

  const handleClearPerplexity = () => {
    setPerplexityApiKey(null);
    toast.info('API Key de Perplexity eliminada');
  };

  const handleClearAll = () => {
    clearAllKeys();
    toast.info('Todas las API keys han sido eliminadas');
  };

  const configuredCount = [hasGeminiKey, hasPerplexityKey].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <PageHeader
          icon={Settings}
          title="Configuracion"
          subtitle={`Configura tus API keys (${configuredCount}/2 configuradas)`}
          showAiBadge={false}
        />

        <div className="mt-8 space-y-6">
          {/* Aviso de seguridad */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Shield className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-200">
                    Tus API keys se guardan localmente
                  </p>
                  <p className="text-xs text-amber-200/70">
                    Las keys se almacenan en el localStorage de tu navegador y nunca se envian a nuestros servidores.
                    Cada llamada a las APIs se hace directamente desde tu navegador.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Key de Gemini */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Google Gemini</CardTitle>
              <CardDescription>
                Utilizada para el analisis tecnico de graficos con vision por IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyInput
                type="gemini"
                value={geminiApiKey}
                onSave={handleSaveGemini}
                onClear={handleClearGemini}
              />
            </CardContent>
          </Card>

          {/* API Key de Perplexity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perplexity</CardTitle>
              <CardDescription>
                Utilizada para la busqueda avanzada de noticias financieras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyInput
                type="perplexity"
                value={perplexityApiKey}
                onSave={handleSavePerplexity}
                onClear={handleClearPerplexity}
              />
            </CardContent>
          </Card>

          {/* Acciones */}
          {(hasGeminiKey || hasPerplexityKey) && (
            <Card className="border-red-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Zona de peligro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleClearAll}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar todas las API keys
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Informacion adicional */}
          <div className="text-xs text-neutral-500 space-y-2 px-1">
            <p>
              <strong className="text-neutral-400">Nota:</strong> Al usar tus propias API keys,
              los costos de uso se cargan directamente a tu cuenta de cada proveedor.
            </p>
            <p>
              Recomendamos no usar esta aplicacion en computadoras compartidas o publicas.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
