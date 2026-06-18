'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Contact, Building2,
  Briefcase, CheckSquare, Activity, Brain,
  FileText, Settings, LogOut, Zap
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useT } from '@/lib/i18n/LanguageContext';
import { UI_LANGS } from '@/lib/i18n/dict';

const navItems = [
  { href: '/dashboard',   icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/leads',       icon: Users,            key: 'nav.leads' },
  { href: '/contacts',    icon: Contact,          key: 'nav.contacts' },
  { href: '/companies',   icon: Building2,        key: 'nav.companies' },
  { href: '/deals',       icon: Briefcase,        key: 'nav.deals' },
  { href: '/tasks',       icon: CheckSquare,      key: 'nav.tasks' },
  { href: '/activities',  icon: Activity,         key: 'nav.activities' },
  { href: '/ai-analysis', icon: Brain,            key: 'nav.ai' },
  { href: '/reports',     icon: FileText,         key: 'nav.reports' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, setLang } = useT();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0d0d0d] border-r border-[#1e1e1e] flex flex-col z-40">
      <div className="px-6 py-5 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#c8ff00] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">BLACKBORZ</div>
            <div className="text-[#c8ff00] text-xs font-medium">CRM</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, key }) => {
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
              {t(key)}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-1 bg-[#141414] border border-[#1e1e1e] rounded-xl p-1">
          {UI_LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === code ? 'bg-[#c8ff00] text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-4 border-t border-[#1e1e1e] space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#888] hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-4 h-4" />
          {t('nav.settings')}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#888] hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          {t('nav.logout')}
        </button>
        <div className="pt-2 px-3">
          <div className="text-xs text-[#444] text-center">v1.0 · Powered by Claude AI</div>
        </div>
      </div>
    </aside>
  );
}
