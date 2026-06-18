'use client';
import { useMemo, useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { useT } from '@/lib/i18n/LanguageContext';
import { Activity, UserPlus, Trophy, XCircle, Brain, Filter } from 'lucide-react';

type ActivityType = 'all' | 'created' | 'won' | 'lost' | 'ai';

interface ActivityEvent {
  id: string;
  type: 'created' | 'won' | 'lost' | 'ai';
  leadName: string;
  company: string;
  value: number;
  date: string;
  status: string;
  source: string;
}

function fmtEur(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M €`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K €`;
  return `${v} €`;
}

function timeAgo(dateStr: string, lang: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) {
    return lang === 'ru' ? 'только что' : lang === 'fr' ? 'à l\'instant' : 'just now';
  }
  if (mins < 60) {
    if (lang === 'ru') return `${mins} мин назад`;
    if (lang === 'fr') return `il y a ${mins} min`;
    return `${mins}m ago`;
  }
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) {
    if (lang === 'ru') return `${hrs} ч назад`;
    if (lang === 'fr') return `il y a ${hrs} h`;
    return `${hrs}h ago`;
  }
  const days = Math.floor(hrs / 24);
  if (days < 30) {
    if (lang === 'ru') return `${days} дн назад`;
    if (lang === 'fr') return `il y a ${days} j`;
    return `${days}d ago`;
  }
  return new Date(dateStr).toLocaleDateString(
    lang === 'ru' ? 'ru-RU' : lang === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'short' }
  );
}

const TYPE_CONFIG = {
  created: {
    icon: UserPlus,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: '#60a5fa',
  },
  won: {
    icon: Trophy,
    color: 'text-[#c8ff00]',
    bg: 'bg-[#c8ff00]/10',
    border: 'border-[#c8ff00]/20',
    dot: '#c8ff00',
  },
  lost: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: '#f87171',
  },
  ai: {
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    dot: '#c084fc',
  },
};

export default function ActivitiesPage() {
  const { leads } = useLeadsStore();
  const { t, lang } = useT();
  const [filter, setFilter] = useState<ActivityType>('all');

  const events: ActivityEvent[] = useMemo(() => {
    const result: ActivityEvent[] = [];
    for (const lead of leads) {
      result.push({
        id: `${lead.id}-created`,
        type: 'created',
        leadName: lead.name,
        company: lead.company,
        value: lead.value,
        date: lead.createdAt,
        status: lead.status,
        source: lead.source,
      });
      if (lead.status === 'won') {
        result.push({
          id: `${lead.id}-won`,
          type: 'won',
          leadName: lead.name,
          company: lead.company,
          value: lead.value,
          date: lead.updatedAt,
          status: lead.status,
          source: lead.source,
        });
      }
      if (lead.status === 'lost') {
        result.push({
          id: `${lead.id}-lost`,
          type: 'lost',
          leadName: lead.name,
          company: lead.company,
          value: lead.value,
          date: lead.updatedAt,
          status: lead.status,
          source: lead.source,
        });
      }
      if (lead.aiScore !== undefined) {
        result.push({
          id: `${lead.id}-ai`,
          type: 'ai',
          leadName: lead.name,
          company: lead.company,
          value: lead.value,
          date: lead.updatedAt,
          status: lead.status,
          source: lead.source,
        });
      }
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [leads]);

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  const counts = {
    all: events.length,
    created: events.filter((e) => e.type === 'created').length,
    won: events.filter((e) => e.type === 'won').length,
    lost: events.filter((e) => e.type === 'lost').length,
    ai: events.filter((e) => e.type === 'ai').length,
  };

  const filters: { id: ActivityType; label: string }[] = [
    { id: 'all', label: t('activity.all') },
    { id: 'created', label: t('activity.created') },
    { id: 'won', label: t('activity.won') },
    { id: 'lost', label: t('activity.lost') },
    { id: 'ai', label: t('activity.ai') },
  ];

  function getEventLabel(type: ActivityEvent['type']) {
    if (type === 'created') return t('activity.leadCreated');
    if (type === 'won') return t('activity.leadWon');
    if (type === 'lost') return t('activity.leadLost');
    return t('activity.aiAnalyzed');
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">CRM</span>
        </div>
        <h1 className="text-3xl font-black text-white">{t('nav.activities')}</h1>
        <p className="text-[#666] text-sm mt-1">{t('activity.subtitle')}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-[#141414] border border-[#242424] rounded-xl p-1 mb-6 w-fit flex-wrap">
        <Filter className="w-3.5 h-3.5 text-[#444] ml-1 mr-0.5" />
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.id ? 'bg-[#c8ff00] text-black' : 'text-[#666] hover:text-white'
            }`}
          >
            {f.label}
            <span className={`text-[10px] px-1 rounded-full ${filter === f.id ? 'bg-black/20 text-black' : 'bg-[#222] text-[#555]'}`}>
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#444]">
          <Activity className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">{t('activity.empty')}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#1e1e1e]" />

          <div className="space-y-1">
            {filtered.map((event) => {
              const cfg = TYPE_CONFIG[event.type];
              const Icon = cfg.icon;
              return (
                <div key={event.id} className="flex gap-4 group">
                  {/* Dot + icon */}
                  <div className="relative flex-shrink-0 flex items-start pt-3">
                    <div className={`w-10 h-10 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center z-10 relative transition-all group-hover:scale-110`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 pb-4">
                    <div className={`bg-[#141414] border ${cfg.border} rounded-xl p-3.5 group-hover:border-opacity-50 transition-all`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-[#888] mb-0.5">{getEventLabel(event.type)}</p>
                          <p className="text-sm font-bold text-white">{event.leadName}</p>
                          <p className="text-xs text-[#555]">
                            {t('activity.from')} <span className="text-[#777]">{event.company}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-xs text-[#444]">{timeAgo(event.date, lang)}</span>
                          {event.type !== 'lost' && (
                            <span className={`text-xs font-bold ${event.type === 'won' ? 'text-[#c8ff00]' : 'text-emerald-400'}`}>
                              {fmtEur(event.value)}
                            </span>
                          )}
                        </div>
                      </div>
                      {event.type === 'won' && (
                        <div className="mt-2 pt-2 border-t border-[#1e1e1e] flex items-center gap-1.5">
                          <Trophy className="w-3 h-3 text-[#c8ff00]" />
                          <span className="text-xs text-[#888]">{t('status.won')} — {fmtEur(event.value)}</span>
                        </div>
                      )}
                      {event.type === 'ai' && (
                        <div className="mt-2 pt-2 border-t border-[#1e1e1e] flex items-center gap-1.5">
                          <Brain className="w-3 h-3 text-purple-400" />
                          <span className="text-xs text-[#888]">{t('modal.source')}: {t(`source.${event.source}`)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
