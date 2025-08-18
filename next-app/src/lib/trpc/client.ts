import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../../server/routers';

export const trpc = createTRPCReact<AppRouter>();

// tRPC client configuration
export const trpcClientConfig = {
  links: [],
  transformer: undefined,
};

// Query client configuration
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors
        if (error?.data?.code === 'BAD_REQUEST' || 
            error?.data?.code === 'UNAUTHORIZED' || 
            error?.data?.code === 'FORBIDDEN' || 
            error?.data?.code === 'NOT_FOUND') {
          return false;
        }
        
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false, // Don't retry mutations
    },
  },
};
