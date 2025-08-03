'use client';

import { QueryClientProvider } from './QueryClientProvider';
import { TrpcProvider } from './TrpcProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <TrpcProvider>
        {children}
      </TrpcProvider>
    </QueryClientProvider>
  );
}