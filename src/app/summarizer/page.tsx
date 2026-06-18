'use client';
import { useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { FileText, Loader2, Copy, Check, Zap, Users } from 'lucide-react';
import { Lead } from '@/lib/types';
import { KANBAN_COLUMNS } from '@/lib/mockData';

export default function SummarizerPage() {
  const { leads } = useLeadsStore();
  const [pipelineSummary, setPipelineSummary] = useState('');
  const [singleSummaries, setSingleSummaries] = useState<Record<string, string>>({});
  const [loadingPipeline, setLoadingPipeline] = useState(false);
  const [loadingLead, setLoadingLead] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'leads'>('pipeline');

  async function generatePipelineSummary() {
    setLoadingPipeline(true);
    try {
      const activeleads = leads.filter((l) => l.status !== 'lost');
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: activeleads, type: 'pipeline' }),
      });
      const data = await res.json();
      setPipelineSummary(data.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPipeline(false);
    }
  }

  async function generateLeadSummary(lead: Lead) {
    setLoadingLead(lead.id);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: [lead], type: 'single' }),
      });
      const data = await res.json();
      setSingleSummaries((p) => ({ ...p, [lead.id]: data.summary }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLead(null);
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeLeads = leads.filter((l) => !['won', 'lost'].includes(l.status));

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">AI</span>
        </div>
        <h1 className="text-3xl font-black text-white">Саммаризатор</h1>
        <p className="text-[#666] text-sm mt-1">Генерируйте краткие сводки для пайплайна и отдельных лидов</p>
      </div>

      <div className="flex gap-1 bg-[#141414] border border-[#242424] rounded-xl p-1 mb-6 w-fit">
        <button onClick={() => setActiveTab('pipeline')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pipeline' ? 'bg-[#c8ff00] text-black' : 'text-[#666] hover:text-white'}`}>
          <Zap className="w-4 h-4" />
          Пайплайн
        </button>
        <button onClick={() => setActiveTab('leads')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'leads' ? 'bg-[#c8ff00] text-black' : 'text-[#666] hover:text-white'}`}>
          <Users className="w-4 h-4" />
          По лидам
        </button>
      </div>

      {activeTab === 'pipeline' && (
        <div className="max-w-3xl">
          <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1e1e1e]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Отчёт по пайплайну</h2>
                  <p className="text-sm text-[#666] mt-1">Анализ {leads.filter((l) => l.status !== 'lost').length} активных лидов</p>
                </div>
                <button onClick={generatePipelineSummary} disabled={loadingPipeline} className="flex items-center gap-2 px-4 py-2 bg-[#c8ff00] hover:bg-[#b8ef00] text-black rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                  {loadingPipeline ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {loadingPipeline ? 'Генерирую...' : 'Сгенерировать'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {KANBAN_COLUMNS.slice(0, 6).map((col) => {
                  const count = leads.filter((l) => l.status === col.id).length;
                  const val = leads.filter((l) => l.status === col.id).reduce((s, l) => s + l.value, 0);
                  return (
                    <div key={col.id} className="bg-[#0d0d0d] rounded-xl p-3 border border-[#1a1a1a]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                        <span className="text-xs text-[#666]">{col.title}</span>
                      </div>
                      <div className="text-sm font-bold text-white">{count}</div>
                      <div className="text-xs text-[#555]">{val >= 1_000_000 ? `${(val / 1_000_000).toFixed(1)}M` : `${(val / 1_000).toFixed(0)}K`} €</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {pipelineSummary ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">AI Резюме</span>
                  </div>
                  <button onClick={() => copyText(pipelineSummary)} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white rounded-lg text-xs transition-all">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
                <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[#1e1e1e]">
                  <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{pipelineSummary}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="w-10 h-10 text-[#2a2a2a] mx-auto mb-3" />
                <p className="text-[#555] text-sm">Нажмите «Сгенерировать» для создания отчёта по пайплайну</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-3 max-w-3xl">
          {activeLeads.map((lead) => {
            const summary = singleSummaries[lead.id];
            const isLoading = loadingLead === lead.id;
            const col = KANBAN_COLUMNS.find((c) => c.id === lead.status);
            return (
              <div key={lead.id} className="bg-[#141414] border border-[#242424] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col?.color }} />
                    <div>
                      <div className="font-semibold text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-[#666]">{lead.company} · {col?.title}</div>
                    </div>
                  </div>
                  <button onClick={() => generateLeadSummary(lead)} disabled={isLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-medium transition-all disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                    {isLoading ? 'Генерирую...' : 'Резюме'}
                  </button>
                </div>
                {summary && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[#1e1e1e]">
                      <p className="text-[#bbb] text-sm leading-relaxed">{summary}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
