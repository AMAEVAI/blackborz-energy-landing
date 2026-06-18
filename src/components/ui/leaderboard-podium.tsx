'use client';
import { cn } from '@/lib/utils';

export interface LeaderboardRanking {
  userId: string;
  rank: 1 | 2 | 3;
  name: string;
  value: string;
  subtitle?: string;
}

const RANK_STYLE = {
  1: {
    medal: '🥇',
    ring: 'ring-[#c8ff00]/40',
    bg: 'bg-[#c8ff00]',
    text: 'text-black',
    nameCls: 'text-[#c8ff00]',
    podiumH: 'h-20',
    podiumBg: 'bg-[#c8ff00]/10 border-[#c8ff00]/20',
    order: 'order-2',
  },
  2: {
    medal: '🥈',
    ring: 'ring-white/20',
    bg: 'bg-[#666]',
    text: 'text-white',
    nameCls: 'text-white',
    podiumH: 'h-14',
    podiumBg: 'bg-white/5 border-white/10',
    order: 'order-1',
  },
  3: {
    medal: '🥉',
    ring: 'ring-white/10',
    bg: 'bg-[#3a2a0e]',
    text: 'text-[#c8964a]',
    nameCls: 'text-[#999]',
    podiumH: 'h-10',
    podiumBg: 'bg-white/5 border-white/10',
    order: 'order-3',
  },
} as const;

function Avatar({ name, rank }: { name: string; rank: 1 | 2 | 3 }) {
  const s = RANK_STYLE[rank];
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div className={cn('w-12 h-12 rounded-full ring-2 flex items-center justify-center text-sm font-bold flex-shrink-0', s.ring, s.bg, s.text)}>
      {initials}
    </div>
  );
}

interface LeaderboardPodiumProps {
  rankings: LeaderboardRanking[];
  className?: string;
}

export function LeaderboardPodium({ rankings, className }: LeaderboardPodiumProps) {
  const sorted = [rankings.find((r) => r.rank === 2), rankings.find((r) => r.rank === 1), rankings.find((r) => r.rank === 3)].filter(Boolean) as LeaderboardRanking[];

  return (
    <div className={cn('flex items-end justify-center gap-3', className)}>
      {sorted.map((r) => {
        const s = RANK_STYLE[r.rank];
        return (
          <div key={r.userId} className={cn('flex flex-col items-center gap-2 flex-1', s.order)}>
            <span className="text-xl">{s.medal}</span>
            <Avatar name={r.name} rank={r.rank} />
            <div className="text-center min-w-0 w-full">
              <div className={cn('text-xs font-bold truncate', s.nameCls)}>{r.name}</div>
              {r.subtitle && <div className="text-[10px] text-[#555] truncate">{r.subtitle}</div>}
              <div className="text-sm font-black text-white mt-0.5">{r.value}</div>
            </div>
            <div className={cn('w-full rounded-t-lg border', s.podiumH, s.podiumBg)} />
          </div>
        );
      })}
    </div>
  );
}
