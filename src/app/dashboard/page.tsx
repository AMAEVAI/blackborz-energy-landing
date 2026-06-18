'use client';
import { useLeadsStore } from '@/store/leadsStore';
import StatsCard from '@/components/StatsCard';
import { TrendingUp, Users, Trophy, DollarSign, BarChart3, Target, Zap, Loader2 } from 'lucide-react';
import { KANBAN_COLUMNS } from '@/lib/mockData';
import Link from 'next/link';

function formatMoney(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ₽`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K ₽`;
  return `${v} ₽`;
}

export default function DashboardPage() {
  const { leads, getStats, isLoading } = useLeadsStore();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-[#666]">
          <Loader2 className="w-5 h-5 animate-spin text-[#c8ff00]" />
          <span className="text-sm">Загрузка данных...</span>
        </div>
      </div>
    );
  }
  const stats = getStats();

  const pipelineValue = leads
    .filter((l) => !['won', 'lost'].includes(l.status))
    .reduce((s, l) => s + l.value, 0);

  const byStatus = KANBAN_COLUMNS.map((col) => ({
    ...col,
    count: leads.filter((l) => l.status === col.id).length,
    value: leads.filter((l) => l.status === col.id).reduce((s, l) => s + l.value, 0),
  }));

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const highPriority = leads
    .filter((l) => l.priority === 'high' && !['won', 'lost'].includes(l.status))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-[#c8ff00]" fill="currentColor" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">BLACKBORZ ENERGY CRM</span>
        </div>
        <h1 className="text-3xl font-black text-white">Дашборд</h1>
        <p className="text-[#666] text-sm mt-1">Общая картина продаж энергетиков</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard icon={Users} label="Всего лидов" value={stats.totalLeads} sub="в базе" />
        <StatsCard icon={TrendingUp} label="Новые" value={stats.newLeads} sub="требуют внимания" />
        <StatsCard icon={Trophy} label="Выиграно" value={stats.wonDeals} sub="сделок" accent />
        <StatsCard icon={DollarSign} label="Выручка" value={formatMoney(stats.totalValue)} sub="закрытые сделки" accent />
        <StatsCard icon={BarChart3} label="Конверсия" value={`${stats.conversionRate}%`} sub="win rate" />
        <StatsCard icon={Target} label="Пайплайн" value={formatMoney(pipelineValue)} sub="активные сделки" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline by stage */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#242424] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Пайплайн по этапам</h2>
          <div className="space-y-3">
            {byStatus.map((col) => {
              const maxVal = Math.max(...byStatus.map((c) => c.value), 1);
              const pct = (col.value / maxVal) * 100;
              return (
                <div key={col.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-[#666] flex-shrink-0">{col.title}</div>
                  <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: col.color }}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 w-32 justify-end">
                    <span className="text-xs text-[#555]">{col.count} лидов</span>
                    <span className="text-xs font-medium text-white">{formatMoney(col.value)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High priority */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Горячие лиды</h2>
            <Link href="/leads" className="text-xs text-[#c8ff00] hover:underline">
              Все →
            </Link>
          </div>
          <div className="space-y-3">
            {highPriority.length > 0 ? (
              highPriority.map((lead) => (
                <div key={lead.id} className="flex items-start gap-3 p-3 bg-[#0d0d0d] rounded-xl border border-[#1e1e1e]">
                  <div className="w-2 h-2 rounded-full bg-[#c8ff00] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{lead.name}</div>
                    <div className="text-xs text-[#666] truncate">{lead.company}</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">{formatMoney(lead.value)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[#444] text-sm">Нет горячих лидов</div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-3 bg-[#141414] border border-[#242424] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Последняя активность</h2>
          <div className="space-y-2">
            {recentLeads.map((lead) => {
              const col = KANBAN_COLUMNS.find((c) => c.id === lead.status);
              return (
                <div key={lead.id} className="flex items-center gap-3 p-3 hover:bg-[#1a1a1a] rounded-xl transition-all">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col?.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white">{lead.name}</span>
                    <span className="text-[#555] text-sm mx-1">·</span>
                    <span className="text-sm text-[#666]">{lead.company}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${col?.color}20`, color: col?.color }}>
                    {col?.title}
                  </span>
                  <span className="text-xs text-[#555] flex-shrink-0">
                    {new Date(lead.updatedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
