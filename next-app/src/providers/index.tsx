'use client';

import { QueryClientProvider } from './QueryClientProvider';
import { TrpcProvider } from './TrpcProvider';
import { ThemeProvider } from '@/components/providers';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <TrpcProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </TrpcProvider>
    </QueryClientProvider>
  );
}