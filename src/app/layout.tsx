import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['cyrillic', 'latin'] });

export const metadata: Metadata = {
  title: 'BLACKBORZ ENERGY — CRM',
  description: 'CRM система для управления продажами BLACKBORZ ENERGY DRINK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#080808] text-white antialiased`}>
        <Sidebar />
        <main className="pl-64 min-h-screen">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
