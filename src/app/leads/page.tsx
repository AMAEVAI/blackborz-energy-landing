'use client';
import KanbanBoard from '@/components/KanbanBoard';
import { Users } from 'lucide-react';
import { useT } from '@/lib/i18n/LanguageContext';

export default function LeadsPage() {
  const { t } = useT();
  return (
    <div className="p-4 md:p-8 h-[calc(100dvh-8.5rem)] md:h-screen flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">BLACKBORZ CRM</span>
        </div>
        <h1 className="text-3xl font-black text-white">{t('leads.title')}</h1>
        <p className="text-[#666] text-sm mt-1">{t('leads.subtitle')}</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
