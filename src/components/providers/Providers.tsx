'use client';

import { type ReactNode } from 'react';
import { ApiKeysProvider } from '@/context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApiKeysProvider>
      {children}
    </ApiKeysProvider>
  );
}
