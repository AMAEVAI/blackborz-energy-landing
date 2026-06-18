'use client';
import { useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { AIAnalysisResult, Lead } from '@/lib/types';
import { Brain, Loader2, CheckCircle, AlertTriangle, ArrowRight, TrendingUp, Star, BarChart3 } from 'lucide-react';

const potentialConfig = {
  low: { label: 'Низкий', color: 'text-gray-400', bg: 'bg-gray-500/10', bar: 'bg-gray-400' },
  medium: { label: 'Средний', color: 'text-amber-400', bg: 'bg-amber-500/10', bar: 'bg-amber-400' },
  high: { label: 'Высокий', color: 'text-[#c8ff00]', bg: 'bg-[#c8ff00]/10', bar: 'bg-[#c8ff00]' },
  very_high: { label: 'Очень высокий', color: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'bg-emerald-400' },
};

export default function AIAnalysisPage() {
  const { leads, updateLead } = useLeadsStore();
  const [results, setResults] = useState<Record<string, AIAnalysisResult>>({});
  const [analyzing, setAnalyzing] = useState<Record<string, boolean>>({});
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const activeLeads = leads.filter((l) => !['won', 'lost'].includes(l.status));

  async function analyzeOne(lead: Lead) {
    setAnalyzing((p) => ({ ...p, [lead.id]: true }));
    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      const data: AIAnalysisResult = await res.json();
      setResults((p) => ({ ...p, [lead.id]: data }));
      updateLead(lead.id, { aiScore: data.score, aiAnalysis: data.summary });
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing((p) => ({ ...p, [lead.id]: false }));
    }
  }

  async function analyzeAll() {
    for (const lead of activeLeads) {
      if (!results[lead.id]) await analyzeOne(lead);
    }
  }

  const selectedLead = leads.find((l) => l.id === selectedLeadId);
  const selectedResult = selectedLeadId ? results[selectedLeadId] : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">AI</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">AI Анализ лидов</h1>
            <p className="text-[#666] text-sm mt-1">Оценка потенциала каждого лида с помощью Claude AI</p>
          </div>
          <button onClick={analyzeAll} disabled={Object.values(analyzing).some(Boolean)} className="flex items-center gap-2 px-5 py-2.5 bg-[#c8ff00] hover:bg-[#b8ef00] text-black rounded-xl text-sm font-bold transition-all disabled:opacity-50">
            <Brain className="w-4 h-4" />
            Анализировать всех
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="text-xs text-[#555] font-medium uppercase tracking-wide mb-3">Активные лиды · {activeLeads.length}</div>
          {activeLeads.map((lead) => {
            const result = results[lead.id];
            const isLoading = analyzing[lead.id];
            const isSelected = selectedLeadId === lead.id;
            return (
              <div key={lead.id} onClick={() => setSelectedLeadId(lead.id)} className={`bg-[#141414] border rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-[#c8ff00]/40 bg-[#c8ff00]/5' : 'border-[#242424] hover:border-[#333]'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{lead.name}</div>
                    <div className="text-xs text-[#666] mt-0.5">{lead.company}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {result ? (
                      <div className="flex items-center gap-1.5">
                        <div className="text-lg font-black text-[#c8ff00]">{result.score}</div>
                        <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${potentialConfig[result.potential].color} ${potentialConfig[result.potential].bg}`}>{potentialConfig[result.potential].label}</div>
                      </div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); analyzeOne(lead); }} disabled={isLoading} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-[#c8ff00] hover:border-[#c8ff00]/30 rounded-lg text-xs transition-all disabled:opacity-50">
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                        {isLoading ? 'Анализ...' : 'Анализ'}
                      </button>
                    )}
                  </div>
                </div>
                {result && (
                  <div className="mt-3 pt-3 border-t border-[#1e1e1e]">
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${potentialConfig[result.potential].bar}`} style={{ width: `${result.score}%` }} />
                    </div>
                    <p className="text-xs text-[#888] mt-2 line-clamp-2">{result.summary}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="sticky top-8">
          {selectedResult && selectedLead ? (
            <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e1e1e] bg-[#c8ff00]/5">
                <div className="text-xs text-[#c8ff00] font-bold uppercase tracking-wide mb-1">AI Детальный анализ</div>
                <div className="text-lg font-bold text-white">{selectedLead.name}</div>
                <div className="text-sm text-[#888]">{selectedLead.company}</div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#c8ff00" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(selectedResult.score / 100) * 201} 201`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-[#c8ff00]">{selectedResult.score}</span>
                    </div>
                  </div>
                  <div>
                    <div className={`text-base font-bold ${potentialConfig[selectedResult.potential].color}`}>{potentialConfig[selectedResult.potential].label} потенциал</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-400">{(selectedLead.value / 1000).toFixed(0)}K ₽</span>
                    </div>
                    <p className="text-xs text-[#666] mt-2">{selectedResult.summary}</p>
                  </div>
                </div>
                {selectedResult.strengths.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-sm font-semibold text-emerald-400">Сильные стороны</span></div>
                    <ul className="space-y-1.5">{selectedResult.strengths.map((s, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#aaa]"><Star className="w-3 h-3 text-emerald-400/60 mt-0.5 flex-shrink-0" />{s}</li>))}</ul>
                  </div>
                )}
                {selectedResult.risks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-400" /><span className="text-sm font-semibold text-amber-400">Риски</span></div>
                    <ul className="space-y-1.5">{selectedResult.risks.map((r, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#aaa]"><AlertTriangle className="w-3 h-3 text-amber-400/60 mt-0.5 flex-shrink-0" />{r}</li>))}</ul>
                  </div>
                )}
                {selectedResult.nextSteps.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2"><ArrowRight className="w-4 h-4 text-blue-400" /><span className="text-sm font-semibold text-blue-400">Следующие шаги</span></div>
                    <ul className="space-y-1.5">{selectedResult.nextSteps.map((s, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#aaa]"><span className="text-xs text-blue-400/60 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>{s}</li>))}</ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-8 text-center">
              <BarChart3 className="w-12 h-12 text-[#2a2a2a] mx-auto mb-4" />
              <p className="text-[#555] text-sm">Выберите лида для просмотра детального AI анализа</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
