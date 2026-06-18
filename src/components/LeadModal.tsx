'use client';
import { useState } from 'react';
import { Lead, LeadStatus, AIAnalysisResult } from '@/lib/types';
import { useLeadsStore } from '@/store/leadsStore';
import {
  X, Brain, FileText, Building2, Mail, Phone, MapPin,
  Tag, TrendingUp, Loader2, CheckCircle, AlertTriangle,
  ArrowRight, ChevronDown, Trash2
} from 'lucide-react';
import { KANBAN_COLUMNS } from '@/lib/mockData';
import { useT } from '@/lib/i18n/LanguageContext';

interface LeadModalProps {
  lead: Lead;
  onClose: () => void;
}

export default function LeadModal({ lead, onClose }: LeadModalProps) {
  const { updateLead, deleteLead, moveLead, setIsAnalyzing, setIsSummarizing, isAnalyzing, isSummarizing } = useLeadsStore();
  const { t } = useT();
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(
    lead.aiScore
      ? {
          score: lead.aiScore,
          potential: lead.aiScore >= 80 ? 'high' : lead.aiScore >= 60 ? 'medium' : 'low',
          strengths: [],
          risks: [],
          nextSteps: [],
          summary: lead.aiAnalysis || '',
        }
      : null
  );
  const [summary, setSummary] = useState(lead.aiSummary || '');
  const [activeTab, setActiveTab] = useState<'info' | 'ai' | 'summary'>('info');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      const data: AIAnalysisResult = await res.json();
      setAiResult(data);
      updateLead(lead.id, {
        aiScore: data.score,
        aiAnalysis: data.summary,
      });
      setActiveTab('ai');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSummarize() {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: [lead], type: 'single' }),
      });
      const data = await res.json();
      setSummary(data.summary);
      updateLead(lead.id, { aiSummary: data.summary });
      setActiveTab('summary');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  }

  function handleDelete() {
    if (confirm(t('modal.confirmDelete'))) {
      deleteLead(lead.id);
      onClose();
    }
  }

  const potentialColors = {
    low: 'text-gray-400',
    medium: 'text-amber-400',
    high: 'text-[#c8ff00]',
    very_high: 'text-emerald-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#0d0d0d] border border-[#242424] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-[#1e1e1e]">
          <div>
            <h2 className="text-lg font-bold text-white">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4 text-[#666]" />
              <span className="text-[#888] text-sm">{lead.company}</span>
              {lead.region && (
                <>
                  <span className="text-[#444]">·</span>
                  <MapPin className="w-3.5 h-3.5 text-[#666]" />
                  <span className="text-[#888] text-sm">{lead.region}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDelete} className="p-2 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1e1e1e] bg-[#0a0a0a]">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#c8ff00]/10 hover:bg-[#c8ff00]/20 border border-[#c8ff00]/20 text-[#c8ff00] rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
            {t('nav.ai')}
          </button>
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            {t('sum.leadSummary')}
          </button>

          <div className="relative ml-auto">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white rounded-lg text-sm transition-all"
            >
              {t('modal.move')}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-1 bg-[#141414] border border-[#242424] rounded-xl overflow-hidden shadow-2xl z-10 min-w-[160px]">
                {KANBAN_COLUMNS.filter((c) => c.id !== lead.status).map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      moveLead(lead.id, col.id as LeadStatus);
                      setShowStatusMenu(false);
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    {col.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex border-b border-[#1e1e1e]">
          {(['info', 'ai', 'summary'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-[#c8ff00] text-[#c8ff00]'
                  : 'border-transparent text-[#666] hover:text-white'
              }`}
            >
              {tab === 'info' && t('modal.info')}
              {tab === 'ai' && t('nav.ai')}
              {tab === 'summary' && t('sum.leadSummary')}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoBlock label="Email" icon={<Mail className="w-3.5 h-3.5" />} value={lead.email} />
                <InfoBlock label={t('modal.phone')} icon={<Phone className="w-3.5 h-3.5" />} value={lead.phone} />
                <InfoBlock label={t('modal.source')} icon={<TrendingUp className="w-3.5 h-3.5" />} value={t(`source.${lead.source}`) || lead.source} />
                <InfoBlock label={t('modal.value')} icon={<TrendingUp className="w-3.5 h-3.5" />} value={lead.value.toLocaleString('fr-FR') + ' €'} highlight />
              </div>
              {lead.notes && (
                <div className="bg-[#141414] border border-[#242424] rounded-xl p-4">
                  <div className="text-xs text-[#666] mb-2 font-medium uppercase tracking-wide">{t('modal.notes')}</div>
                  <p className="text-[#ccc] text-sm leading-relaxed">{lead.notes}</p>
                </div>
              )}
              {lead.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-3.5 h-3.5 text-[#666]" />
                    <span className="text-xs text-[#666] font-medium uppercase tracking-wide">{t('modal.tags')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] rounded-lg text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              {!aiResult ? (
                <div className="text-center py-10">
                  <Brain className="w-10 h-10 text-[#333] mx-auto mb-3" />
                  <p className="text-[#666] text-sm mb-4">{t('modal.analyzeHint')}</p>
                  <button onClick={handleAnalyze} disabled={isAnalyzing} className="px-4 py-2 bg-[#c8ff00] text-black rounded-lg text-sm font-bold hover:bg-[#b8ef00] transition-all disabled:opacity-50">
                    {isAnalyzing ? t('ai.analyzing') : t('modal.runAnalysis')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-[#141414] border border-[#242424] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[#888] font-medium">{t('modal.aiScore')}</span>
                      <span className={`text-sm font-bold ${potentialColors[aiResult.potential]}`}>
                        {t(`potential.${aiResult.potential}`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#c8ff00] to-emerald-400 transition-all duration-700" style={{ width: `${aiResult.score}%` }} />
                      </div>
                      <span className="text-2xl font-black text-white w-10 text-right">{aiResult.score}</span>
                    </div>
                  </div>
                  {aiResult.summary && (
                    <div className="bg-[#c8ff00]/5 border border-[#c8ff00]/20 rounded-xl p-4">
                      <p className="text-[#ccc] text-sm leading-relaxed">{aiResult.summary}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    {aiResult.strengths.length > 0 && <AISection icon={<CheckCircle className="w-4 h-4 text-emerald-400" />} title={t('ai.strengths')} items={aiResult.strengths} color="text-emerald-400" />}
                    {aiResult.risks.length > 0 && <AISection icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title={t('ai.risks')} items={aiResult.risks} color="text-amber-400" />}
                    {aiResult.nextSteps.length > 0 && <AISection icon={<ArrowRight className="w-4 h-4 text-blue-400" />} title={t('ai.nextSteps')} items={aiResult.nextSteps} color="text-blue-400" />}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div>
              {!summary ? (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 text-[#333] mx-auto mb-3" />
                  <p className="text-[#666] text-sm mb-4">{t('modal.summaryHint')}</p>
                  <button onClick={handleSummarize} disabled={isSummarizing} className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-bold hover:bg-purple-400 transition-all disabled:opacity-50">
                    {isSummarizing ? t('modal.creatingSummary') : t('modal.createSummary')}
                  </button>
                </div>
              ) : (
                <div className="bg-[#141414] border border-[#242424] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">{t('modal.aiSummary')}</span>
                  </div>
                  <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, icon, value, highlight }: { label: string; icon: React.ReactNode; value: string; highlight?: boolean }) {
  return (
    <div className="bg-[#141414] border border-[#242424] rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-[#666] mb-1.5">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-sm font-medium ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function AISection({ icon, title, items, color }: { icon: React.ReactNode; title: string; items: string[]; color: string }) {
  return (
    <div className="bg-[#141414] border border-[#242424] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className={`text-sm font-medium ${color}`}>{title}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#aaa]">
            <span className="text-[#555] mt-0.5">·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
