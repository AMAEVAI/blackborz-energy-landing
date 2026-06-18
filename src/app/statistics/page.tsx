'use client';
import { useMemo, useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { BarChart3, TrendingUp, Euro, Target, Users, Award, Layers, Zap } from 'lucide-react';
import { LeaderboardCard } from '@/components/ui/leaderboard-card';
import type { LeaderboardRanking } from '@/components/ui/leaderboard-podium';
import type { LeaderboardRankingItem } from '@/components/ui/leaderboard-rankings';
import { KANBAN_COLUMNS } from '@/lib/mockData';
import { useT } from '@/lib/i18n/LanguageContext';

type GroupBy = 'company' | 'source' | 'region';

function fmtEur(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M €`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K €`;
  return `${v} €`;
}

function KpiCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string; sub?: string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`bg-[#141414] border rounded-xl p-4 ${accent ? 'border-[#c8ff00]/20 bg-[#c8ff00]/5' : 'border-[#242424]'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${accent ? 'text-[#c8ff00]' : 'text-[#555]'}`} />
        <span className="text-xs text-[#666] font-medium">{label}</span>
      </div>
      <div className={`text-2xl font-black ${accent ? 'text-[#c8ff00]' : 'text-white'}`}>{value}</div>
      {sub && <div className="text-xs text-[#555] mt-0.5">{sub}</div>}
    </div>
  );
}

export default function StatisticsPage() {
  const { leads } = useLeadsStore();
  const { t, lang } = useT();
  const [groupBy, setGroupBy] = useState<GroupBy>('company');
  const [runId, setRunId] = useState<'value' | 'count'>('value');

  const activeLeads = leads.filter((l) => l.status !== 'lost');
  const wonLeads = leads.filter((l) => l.status === 'won');

  const totalPipeline = activeLeads.reduce((s, l) => s + l.value, 0);
  const totalWon = wonLeads.reduce((s, l) => s + l.value, 0);
  const avgDeal = activeLeads.length ? totalPipeline / activeLeads.length : 0;
  const conversionRate = leads.length ? ((wonLeads.length / leads.length) * 100).toFixed(1) : '0.0';

  const groupedData = useMemo(() => {
    const map = new Map<string, { name: string; totalValue: number; count: number }>();
    for (const lead of activeLeads) {
      const key =
        groupBy === 'company' ? (lead.company || '—') :
        groupBy === 'source' ? t(`source.${lead.source}`) :
        (lead.region || '—');
      const existing = map.get(key) ?? { name: key, totalValue: 0, count: 0 };
      existing.totalValue += lead.value;
      existing.count += 1;
      map.set(key, existing);
    }
    return Array.from(map.values()).sort((a, b) =>
      runId === 'value' ? b.totalValue - a.totalValue : b.count - a.count
    );
  }, [activeLeads, groupBy, runId, lang]);

  const podiumRankings: LeaderboardRanking[] = groupedData.slice(0, 3).map((item, i) => ({
    userId: item.name,
    rank: (i + 1) as 1 | 2 | 3,
    name: item.name,
    value: runId === 'value' ? fmtEur(item.totalValue) : `${item.count} ${t('stat.leads')}`,
    subtitle: runId === 'value' ? `${item.count} ${t('stat.leads')}` : fmtEur(item.totalValue),
  }));

  const rankings: LeaderboardRankingItem[] = groupedData.map((item, i) => ({
    userId: item.name,
    rank: i + 1,
    name: item.name,
    value: runId === 'value' ? fmtEur(item.totalValue) : `${item.count}`,
    subtitle: runId === 'value' ? `${item.count} лидов` : fmtEur(item.totalValue),
  }));

  const statusBreakdown = KANBAN_COLUMNS.map((col) => {
    const colLeads = leads.filter((l) => l.status === col.id);
    const val = colLeads.reduce((s, l) => s + l.value, 0);
    return { ...col, count: colLeads.length, value: val };
  });

  const maxStatus = Math.max(...statusBreakdown.map((s) => s.value), 1);

  const fromDate = activeLeads.length
    ? new Date(Math.min(...activeLeads.map((l) => new Date(l.createdAt).getTime())))
    : new Date();
  const toDate = new Date();

  const GROUP_OPTIONS = [
    { id: 'company', label: t('stat.byCompany') },
    { id: 'source', label: t('stat.bySource') },
    { id: 'region', label: t('stat.byRegion') },
  ];

  const RUN_OPTIONS = [
    { id: 'value', label: t('stat.byValue') },
    { id: 'count', label: t('stat.byCount') },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">CRM</span>
        </div>
        <h1 className="text-3xl font-black text-white">{t('stat.title')}</h1>
        <p className="text-[#666] text-sm mt-1">{t('stat.subtitle')}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label={t('stat.pipeline')} value={fmtEur(totalPipeline)} sub={`${activeLeads.length} лидов`} icon={Layers} accent />
        <KpiCard label={t('stat.wonRevenue')} value={fmtEur(totalWon)} sub={`${wonLeads.length} сделок`} icon={Euro} />
        <KpiCard label={t('stat.avgDeal')} value={fmtEur(avgDeal)} sub="средняя сделка" icon={TrendingUp} />
        <KpiCard label={t('stat.conversion')} value={`${conversionRate}%`} sub="win rate" icon={Target} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="xl:col-span-2">
          {/* Group by tabs */}
          <div className="flex items-center gap-1 bg-[#141414] border border-[#242424] rounded-xl p-1 mb-4 w-fit">
            {GROUP_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGroupBy(opt.id as GroupBy)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  groupBy === opt.id ? 'bg-[#c8ff00] text-black' : 'text-[#666] hover:text-white'
                }`}
              >
                {opt.id === 'company' && <Users className="w-3 h-3" />}
                {opt.id === 'source' && <Zap className="w-3 h-3" />}
                {opt.id === 'region' && <Target className="w-3 h-3" />}
                {opt.label}
              </button>
            ))}
          </div>

          <LeaderboardCard
            title={t('stat.leaderboard')}
            fromDate={fromDate}
            toDate={toDate}
            podiumRankings={podiumRankings}
            rankings={rankings}
            runOptions={RUN_OPTIONS}
            selectedRunId={runId}
            onRunChange={(id) => setRunId(id as 'value' | 'count')}
          />
        </div>

        {/* Right column: pipeline funnel + top stats */}
        <div className="space-y-4">
          {/* Pipeline by stage */}
          <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#c8ff00]" />
              <span className="text-sm font-bold text-white">{t('stat.funnel')}</span>
            </div>
            <div className="space-y-2.5">
              {statusBreakdown.map((col) => (
                <div key={col.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                      <span className="text-xs text-[#888]">{t(`status.${col.id}`)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-white">{col.count}</span>
                      <span className="text-xs text-[#555] ml-1.5">{fmtEur(col.value)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(col.value / maxStatus) * 100}%`, backgroundColor: col.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#c8ff00]" />
              <span className="text-sm font-bold text-white">{t('stat.summary')}</span>
            </div>
            <div className="space-y-3">
              {[
                { label: t('stat.totalLeads'), value: leads.length },
                { label: t('stat.activeLeads'), value: activeLeads.length },
                { label: t('stat.wonLeads'), value: wonLeads.length },
                { label: t('stat.lostLeads'), value: leads.filter((l) => l.status === 'lost').length },
                { label: t('stat.uniqueCompanies'), value: new Set(leads.map((l) => l.company)).size },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">{label}</span>
                  <span className="text-sm font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
