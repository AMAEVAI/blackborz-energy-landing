import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import DataProvider from '@/components/DataProvider';
import { createClient } from '@/lib/supabase/server';

const inter = Inter({ subsets: ['cyrillic', 'latin'] });

export const metadata: Metadata = {
  title: 'BLACKBORZ ENERGY — CRM',
  description: 'CRM система для управления продажами BLACKBORZ ENERGY DRINK',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#080808] text-white antialiased`}>
        {user ? (
          <>
            <Sidebar />
            <main className="pl-64 min-h-screen">
              <DataProvider>{children}</DataProvider>
            </main>
          </>
        ) : (
          <main className="min-h-screen">{children}</main>
        )}
      </body>
    </html>
  );
}
