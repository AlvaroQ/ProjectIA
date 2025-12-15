'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { API_KEY_CONFIG, getValidationError, maskApiKey } from '@/lib/api-keys-validation';
import type { ApiKeyType } from '@/types';

interface ApiKeyInputProps {
  type: ApiKeyType;
  value: string | null;
  onSave: (key: string) => void;
  onClear: () => void;
}

export function ApiKeyInput({ type, value, onSave, onClear }: ApiKeyInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!value);

  const config = API_KEY_CONFIG[type];
  const isConfigured = value !== null && value.length > 0;

  const handleSave = () => {
    const validationError = getValidationError(type, inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(inputValue.trim());
    setInputValue('');
    setError(null);
    setIsEditing(false);
  };

  const handleClear = () => {
    onClear();
    setInputValue('');
    setError(null);
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-neutral-200">
          {config.name} API Key
        </Label>
        <a
          href={config.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Obtener key
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {isConfigured && !isEditing ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm text-neutral-300 font-mono">
              {showKey ? value : maskApiKey(value)}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowKey(!showKey)}
            className="shrink-0"
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? 'text' : 'password'}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={config.placeholder}
                className={`pr-10 font-mono ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-400" />
                )}
              </Button>
            </div>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!inputValue.trim()}
              className="shrink-0"
            >
              Guardar
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
