'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      toastOptions={{
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
        },
        success: {
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
        },
        error: {
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
        },
        warning: {
          style: {
            background: '#fffbeb',
            color: '#d97706',
            border: '1px solid #fed7aa',
          },
        },
        info: {
          style: {
            background: '#eff6ff',
            color: '#2563eb',
            border: '1px solid #bfdbfe',
          },
        },
      }}
    />
  );
}
