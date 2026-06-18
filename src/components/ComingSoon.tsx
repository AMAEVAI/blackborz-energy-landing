import { LucideIcon } from 'lucide-react';
import { Zap } from 'lucide-react';

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export default function ComingSoon({ icon: Icon, title, description, features }: ComingSoonProps) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">CRM</span>
        </div>
        <h1 className="text-3xl font-black text-white">{title}</h1>
        <p className="text-[#666] text-sm mt-1">{description}</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#c8ff00]/10 border border-[#c8ff00]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-[#c8ff00]" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Скоро будет готово</h2>
          <p className="text-[#666] text-sm mb-6">Этот раздел находится в разработке</p>
          <div className="text-left space-y-2">
            <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">Планируемый функционал:</div>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#888]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]/50 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#1e1e1e] flex items-center justify-center gap-2 text-xs text-[#444]">
            <Zap className="w-3 h-3 text-[#c8ff00]" />
            Powered by BLACKBORZ ENERGY CRM
          </div>
        </div>
      </div>
    </div>
  );
}
