import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatsCard({ icon: Icon, label, value, sub, accent }: StatsCardProps) {
  return (
    <div className={`rounded-2xl p-5 border transition-all ${
      accent
        ? 'bg-[#c8ff00]/5 border-[#c8ff00]/20 hover:border-[#c8ff00]/40'
        : 'bg-[#141414] border-[#242424] hover:border-[#333]'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#666] font-medium uppercase tracking-wide">{label}</span>
        <div className={`p-2 rounded-lg ${accent ? 'bg-[#c8ff00]/10' : 'bg-[#1a1a1a]'}`}>
          <Icon className={`w-4 h-4 ${accent ? 'text-[#c8ff00]' : 'text-[#888]'}`} />
        </div>
      </div>
      <div className={`text-2xl font-black ${accent ? 'text-[#c8ff00]' : 'text-white'}`}>{value}</div>
      {sub && <div className="text-xs text-[#555] mt-1">{sub}</div>}
    </div>
  );
}
