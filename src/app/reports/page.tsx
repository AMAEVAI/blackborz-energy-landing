'use client';
import { useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { KANBAN_COLUMNS } from '@/lib/mockData';
import { useT } from '@/lib/i18n/LanguageContext';
import { FileText, Download, Copy, Check, TrendingUp, Users, Euro, Target, BarChart3, Layers } from 'lucide-react';

function fmtEur(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M €`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K €`;
  return `${v} €`;
}

const SOURCE_KEYS = ['website', 'referral', 'social', 'cold_call', 'event', 'other'] as const;

export default function ReportsPage() {
  const { leads } = useLeadsStore();
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  const activeLeads = leads.filter((l) => !['lost'].includes(l.status));
  const wonLeads = leads.filter((l) => l.status === 'won');
  const lostLeads = leads.filter((l) => l.status === 'lost');
  const totalPipeline = activeLeads.reduce((s, l) => s + l.value, 0);
  const totalWon = wonLeads.reduce((s, l) => s + l.value, 0);
  const conversionRate = leads.length ? ((wonLeads.length / leads.length) * 100).toFixed(1) : '0.0';
  const avgDeal = activeLeads.length ? Math.round(totalPipeline / activeLeads.length) : 0;

  const byStage = KANBAN_COLUMNS.map((col) => {
    const colLeads = leads.filter((l) => l.status === col.id);
    return { ...col, count: colLeads.length, value: colLeads.reduce((s, l) => s + l.value, 0) };
  });

  const bySource = SOURCE_KEYS.map((src) => {
    const srcLeads = leads.filter((l) => l.source === src);
    return { src, label: t(`source.${src}`), count: srcLeads.length, value: srcLeads.reduce((s, l) => s + l.value, 0) };
  }).filter((s) => s.count > 0).sort((a, b) => b.value - a.value);

  const byPriority = (['high', 'medium', 'low'] as const).map((p) => {
    const pLeads = leads.filter((l) => l.priority === p);
    return { priority: p, label: t(`priority.${p}`), count: pLeads.length, value: pLeads.reduce((s, l) => s + l.value, 0) };
  });

  const topLeads = [...activeLeads].sort((a, b) => b.value - a.value).slice(0, 5);

  function buildCsvReport() {
    const lines = [
      t('reports.csvHeader'),
      '',
      `=== ${t('reports.kpi')} ===`,
      `${t('stat.totalLeads')}: ${leads.length}`,
      `${t('stat.activeLeads')}: ${activeLeads.length}`,
      `${t('stat.wonLeads')}: ${wonLeads.length}`,
      `${t('stat.lostLeads')}: ${lostLeads.length}`,
      `${t('stat.pipeline')}: ${fmtEur(totalPipeline)}`,
      `${t('stat.wonRevenue')}: ${fmtEur(totalWon)}`,
      `${t('stat.conversion')}: ${conversionRate}%`,
      `${t('stat.avgDeal')}: ${fmtEur(avgDeal)}`,
      '',
      `=== ${t('stat.funnel')} ===`,
      ...byStage.map((s) => `${t(`status.${s.id}`)}: ${s.count} | ${fmtEur(s.value)}`),
      '',
      `=== ${t('reports.bySource')} ===`,
      ...bySource.map((s) => `${s.label}: ${s.count} | ${fmtEur(s.value)}`),
      '',
      `=== ${t('reports.top5')} ===`,
      ...topLeads.map((l, i) => `${i + 1}. ${l.name} (${l.company}) — ${fmtEur(l.value)}`),
    ];
    return lines.join('\n');
  }

  async function copyReport() {
    await navigator.clipboard.writeText(buildCsvReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadCsv() {
    const csvLines = [
      ['Name', 'Company', 'Status', 'Source', 'Priority', 'Value', 'Region', 'Created'].join(';'),
      ...leads.map((l) => [
        l.name, l.company, t(`status.${l.status}`), t(`source.${l.source}`),
        t(`priority.${l.priority}`), l.value, l.region || '', l.createdAt.slice(0, 10),
      ].join(';')),
    ].join('\n');
    const blob = new Blob(['﻿' + csvLines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blackborz-crm-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const maxStageVal = Math.max(...byStage.map((s) => s.value), 1);
  const maxSourceVal = Math.max(...bySource.map((s) => s.value), 1);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">CRM</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">{t('nav.reports')}</h1>
            <p className="text-[#666] text-sm mt-1">{t('reports.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={copyReport} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white rounded-xl text-sm font-medium transition-all">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? t('sum.copied') : t('sum.copy')}
            </button>
            <button onClick={downloadCsv} className="flex items-center gap-2 px-4 py-2 bg-[#c8ff00] hover:bg-[#b8ef00] text-black rounded-xl text-sm font-bold transition-all">
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: t('stat.totalLeads'), value: String(leads.length), icon: Users },
          { label: t('stat.pipeline'), value: fmtEur(totalPipeline), icon: Layers, accent: true },
          { label: t('stat.wonRevenue'), value: fmtEur(totalWon), icon: Euro },
          { label: t('stat.conversion'), value: `${conversionRate}%`, icon: Target },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className={`bg-[#141414] border rounded-xl p-4 ${accent ? 'border-[#c8ff00]/20 bg-[#c8ff00]/5' : 'border-[#242424]'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${accent ? 'text-[#c8ff00]' : 'text-[#555]'}`} />
              <span className="text-xs text-[#666] font-medium">{label}</span>
            </div>
            <div className={`text-2xl font-black ${accent ? 'text-[#c8ff00]' : 'text-white'}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* By stage */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4 text-[#c8ff00]" />
            <span className="text-sm font-bold text-white">{t('stat.funnel')}</span>
          </div>
          <div className="space-y-3">
            {byStage.map((col) => (
              <div key={col.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-xs text-[#888]">{t(`status.${col.id}`)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#555]">{col.count}</span>
                    <span className="text-xs font-bold text-white w-16 text-right">{fmtEur(col.value)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(col.value / maxStageVal) * 100}%`, backgroundColor: col.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By source */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-[#c8ff00]" />
            <span className="text-sm font-bold text-white">{t('reports.bySource')}</span>
          </div>
          {bySource.length === 0 ? (
            <div className="text-center py-8 text-[#444] text-sm">{t('common.empty')}</div>
          ) : (
            <div className="space-y-3">
              {bySource.map((s) => (
                <div key={s.src}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#888]">{s.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#555]">{s.count}</span>
                      <span className="text-xs font-bold text-white w-16 text-right">{fmtEur(s.value)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c8ff00] rounded-full transition-all duration-500" style={{ width: `${(s.value / maxSourceVal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By priority */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-4 h-4 text-[#c8ff00]" />
            <span className="text-sm font-bold text-white">{t('reports.byPriority')}</span>
          </div>
          <div className="space-y-3">
            {byPriority.map((p) => {
              const color = p.priority === 'high' ? '#c8ff00' : p.priority === 'medium' ? '#f59e0b' : '#6b7280';
              return (
                <div key={p.priority} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-[#888]">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#555]">{p.count} {t('stat.leads')}</span>
                    <span className="text-sm font-bold text-white">{fmtEur(p.value)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 leads */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#c8ff00]" />
            <span className="text-sm font-bold text-white">{t('reports.top5')}</span>
          </div>
          {topLeads.length === 0 ? (
            <div className="text-center py-8 text-[#444] text-sm">{t('common.empty')}</div>
          ) : (
            <div className="space-y-2">
              {topLeads.map((lead, i) => (
                <div key={lead.id} className="flex items-center gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                  <span className="text-xs font-bold text-[#c8ff00] w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{lead.name}</div>
                    <div className="text-xs text-[#555] truncate">{lead.company}</div>
                  </div>
                  <span className="text-sm font-bold text-emerald-400 flex-shrink-0">{fmtEur(lead.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
