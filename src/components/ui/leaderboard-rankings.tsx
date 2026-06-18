'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LeaderboardRankingItem {
  userId: string;
  rank: number;
  name: string;
  value: string;
  subtitle?: string;
  delta?: number;
}

interface LeaderboardRankingsProps {
  rankings: LeaderboardRankingItem[];
  currentUserId?: string;
  showPagination?: boolean;
  defaultPageSize?: number;
  className?: string;
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta > 0) return (
    <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium">
      <TrendingUp className="w-3 h-3" />+{delta}
    </span>
  );
  if (delta < 0) return (
    <span className="flex items-center gap-0.5 text-[10px] text-red-400 font-medium">
      <TrendingDown className="w-3 h-3" />{delta}
    </span>
  );
  return <Minus className="w-3 h-3 text-[#555]" />;
}

export function LeaderboardRankings({ rankings, currentUserId, showPagination = false, defaultPageSize = 10, className }: LeaderboardRankingsProps) {
  const [page, setPage] = useState(0);
  const pageSize = defaultPageSize;
  const totalPages = Math.ceil(rankings.length / pageSize);
  const slice = rankings.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className={cn('space-y-1', className)}>
      {slice.map((item) => {
        const isMe = item.userId === currentUserId;
        const isTop3 = item.rank <= 3;
        return (
          <div
            key={item.userId}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
              isMe ? 'bg-[#c8ff00]/5 border border-[#c8ff00]/20' : 'hover:bg-white/5',
            )}
          >
            <div className={cn(
              'w-6 text-center text-xs font-bold flex-shrink-0',
              isTop3 ? 'text-[#c8ff00]' : 'text-[#555]',
            )}>
              {item.rank}
            </div>

            <div className="w-8 h-8 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#888] flex-shrink-0">
              {item.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className={cn('text-sm font-semibold truncate', isMe ? 'text-[#c8ff00]' : 'text-white')}>
                {item.name}
              </div>
              {item.subtitle && <div className="text-xs text-[#555] truncate">{item.subtitle}</div>}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {item.delta !== undefined && <DeltaBadge delta={item.delta} />}
              <div className="text-sm font-bold text-white">{item.value}</div>
            </div>
          </div>
        );
      })}

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-[#1e1e1e]">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#666] hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Назад
          </button>
          <span className="text-xs text-[#555]">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#666] hover:text-white disabled:opacity-30 transition-all"
          >
            Вперёд <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
