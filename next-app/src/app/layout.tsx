import '@/styles/globals.css';
import { Providers } from '@/providers';

export const metadata = {
  title: 'SIA SMA UII Yogyakarta',
  description: 'project by Koneksi Jaringan Indonesia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
