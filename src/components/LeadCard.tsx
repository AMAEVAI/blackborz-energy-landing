'use client';
import { Lead } from '@/lib/types';
import { Brain, Building2, Mail, Phone, Star, TrendingUp } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
  isDragging?: boolean;
}

const priorityConfig = {
  low: { label: 'Низкий', color: 'text-gray-400', bg: 'bg-gray-500/10' },
  medium: { label: 'Средний', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  high: { label: 'Высокий', color: 'text-[#c8ff00]', bg: 'bg-[#c8ff00]/10' },
};

function formatValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ₽`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K ₽`;
  return `${value} ₽`;
}

export default function LeadCard({ lead, onClick, isDragging }: LeadCardProps) {
  const prio = priorityConfig[lead.priority];

  return (
    <div
      onClick={() => onClick(lead)}
      className={`bg-[#141414] border border-[#242424] rounded-xl p-3.5 cursor-pointer
        hover:border-[#c8ff00]/30 hover:bg-[#161616] transition-all select-none
        ${isDragging ? 'shadow-2xl shadow-[#c8ff00]/10 border-[#c8ff00]/40 rotate-1' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm truncate">{lead.name}</div>
          <div className="flex items-center gap-1 text-xs text-[#666] mt-0.5">
            <Building2 className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{lead.company}</span>
          </div>
        </div>
        {lead.aiScore !== undefined && (
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Brain className="w-3 h-3 text-[#c8ff00]" />
            <span className="text-xs font-bold text-[#c8ff00]">{lead.aiScore}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400">{formatValue(lead.value)}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prio.color} ${prio.bg}`}>
          {prio.label}
        </span>
      </div>

      {/* Tags */}
      {lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {lead.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 bg-[#1e1e1e] text-[#666] rounded-md">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Contact */}
      <div className="space-y-1 pt-2 border-t border-[#1e1e1e]">
        <div className="flex items-center gap-1.5 text-xs text-[#555]">
          <Mail className="w-3 h-3" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#555]">
          <Phone className="w-3 h-3" />
          <span>{lead.phone}</span>
        </div>
      </div>

      {/* AI Badge */}
      {lead.aiAnalysis && (
        <div className="mt-2 pt-2 border-t border-[#1e1e1e]">
          <div className="flex items-start gap-1.5">
            <Star className="w-3 h-3 text-[#c8ff00] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#888] line-clamp-2">{lead.aiAnalysis}</p>
          </div>
        </div>
      )}
    </div>
  );
}
