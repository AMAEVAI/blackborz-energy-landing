'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  Brain,
  FileText,
  Settings,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { href: '/leads', icon: Kanban, label: 'Канбан лидов' },
  { href: '/ai-analysis', icon: Brain, label: 'AI Анализ' },
  { href: '/summarizer', icon: FileText, label: 'Саммаризатор' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0d0d0d] border-r border-[#1e1e1e] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#c8ff00] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">BLACKBORZ</div>
            <div className="text-[#c8ff00] text-xs font-medium">ENERGY CRM</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#c8ff00]/10 text-[#c8ff00] border border-[#c8ff00]/20'
                  : 'text-[#888] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#1e1e1e]">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#888] hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-4 h-4" />
          Настройки
        </Link>
        <div className="mt-3 px-3">
          <div className="text-xs text-[#444] text-center">
            v1.0 · Powered by Claude AI
          </div>
        </div>
      </div>
    </aside>
  );
}
