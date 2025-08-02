'use client';

import { useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '@/server/trpc';

const trpc = createTRPCReact<AppRouter>();

// Setup tRPC client
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function TrpcDemoPage() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Use tRPC hook to fetch hello query
  const helloQuery = trpc.hello.useQuery(name, { enabled: submitted && !!name });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">tRPC Demo</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            type="text"
            className="border px-2 py-1 rounded w-full mb-2"
            placeholder="Masukkan nama..."
            value={name}
            onChange={e => {
              setName(e.target.value);
              setSubmitted(false);
            }}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Kirim
          </button>
        </form>
        {helloQuery.isLoading && <p className="mt-4">Loading...</p>}
        {helloQuery.data && (
          <p className="mt-4 text-green-600">{helloQuery.data}</p>
        )}
        {helloQuery.error && (
          <p className="mt-4 text-red-600">{helloQuery.error.message}</p>
        )}
      </div>
    </trpc.Provider>
  );
}