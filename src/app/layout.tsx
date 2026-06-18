import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import DataProvider from '@/components/DataProvider';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ['cyrillic', 'latin'] });

export const metadata: Metadata = {
  title: 'BLACKBORZ — CRM',
  description: 'CRM система BLACKBORZ',
};

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getUser() {
  if (!SUPABASE_CONFIGURED) return null;
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const showSidebar = SUPABASE_CONFIGURED ? !!user : true;

  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#080808] text-white antialiased`}>
        <LanguageProvider>
          {showSidebar ? (
            <>
              <Sidebar />
              <main className="pl-64 min-h-screen">
                <DataProvider>{children}</DataProvider>
              </main>
            </>
          ) : (
            <main className="min-h-screen">{children}</main>
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}
