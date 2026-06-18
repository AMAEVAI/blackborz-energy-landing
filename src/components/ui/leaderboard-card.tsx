'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { LeaderboardPodium, type LeaderboardRanking as LeaderboardPodiumRanking } from '@/components/ui/leaderboard-podium';
import { LeaderboardRankings, type LeaderboardRankingItem } from '@/components/ui/leaderboard-rankings';

interface LeaderboardRunOption {
  id: string;
  label: string;
}

interface LeaderboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  fromDate: string | Date;
  toDate: string | Date;
  podiumRankings: LeaderboardPodiumRanking[];
  rankings: LeaderboardRankingItem[];
  currentUserId?: string;
  runOptions?: LeaderboardRunOption[];
  selectedRunId?: string;
  onRunChange?: (runId: string) => void;
}

function formatRangeDate(date: string | Date) {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const LeaderboardCard = React.forwardRef<HTMLDivElement, LeaderboardCardProps>(
  ({ className, title = 'Leaderboard', fromDate, toDate, podiumRankings, rankings, currentUserId, runOptions, selectedRunId, onRunChange, ...props }, ref) => {
    const fromLabel = formatRangeDate(fromDate);
    const toLabel = formatRangeDate(toDate);
    const resolvedRunId = selectedRunId ?? runOptions?.[0]?.id ?? '';
    const hasOnRunChange = Boolean(onRunChange);
    const [localRunId, setLocalRunId] = React.useState(resolvedRunId);

    React.useEffect(() => {
      if (hasOnRunChange) return;
      setLocalRunId(resolvedRunId);
    }, [hasOnRunChange, resolvedRunId]);

    const activeRunId = hasOnRunChange ? resolvedRunId : localRunId;

    return (
      <div
        ref={ref}
        className={cn('bg-[#141414] rounded-2xl border border-[#242424] p-6', className)}
        {...props}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-[#555] text-xs">{fromLabel} — {toLabel}</p>
          </div>

          {runOptions && runOptions.length > 0 && (
            <select
              aria-label="Select leaderboard run"
              value={activeRunId}
              onChange={(e) => {
                if (onRunChange) { onRunChange(e.target.value); return; }
                setLocalRunId(e.target.value);
              }}
              className="bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#c8ff00]/40"
            >
              {runOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>

        <LeaderboardPodium rankings={podiumRankings} className="mb-6" />

        <div className="border-t border-[#1e1e1e] pt-4">
          <LeaderboardRankings rankings={rankings} currentUserId={currentUserId} showPagination defaultPageSize={10} />
        </div>
      </div>
    );
  }
);

LeaderboardCard.displayName = 'LeaderboardCard';

export { LeaderboardCard };
export type { LeaderboardCardProps, LeaderboardRunOption };
