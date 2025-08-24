'use client';

import { QueryClientProvider } from './QueryClientProvider';
import { TrpcProvider } from './TrpcProvider';
import { ThemeProvider } from '@/components/providers';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from './ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider>
        <TrpcProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <ToastProvider />
          </ThemeProvider>
        </TrpcProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}