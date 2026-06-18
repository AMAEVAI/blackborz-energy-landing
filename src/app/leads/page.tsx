'use client';
import KanbanBoard from '@/components/KanbanBoard';
import { Kanban } from 'lucide-react';

export default function LeadsPage() {
  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Kanban className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">Канбан</span>
        </div>
        <h1 className="text-3xl font-black text-white">Лиды</h1>
        <p className="text-[#666] text-sm mt-1">Перетаскивайте карточки для изменения статуса</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
