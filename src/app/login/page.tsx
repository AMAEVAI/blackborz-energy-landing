'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react';
import { Lang, LANGS, loginText } from '@/lib/i18n/login';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState<Lang>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved && ['ru', 'fr', 'en'].includes(saved)) setLang(saved);
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    localStorage.setItem('lang', l);
  }

  const t = loginText[lang];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(t.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8ff00]/5 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-5 right-5 flex items-center gap-1 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-1">
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => changeLang(code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              lang === code ? 'bg-[#c8ff00] text-black' : 'text-[#888] hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#c8ff00] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#c8ff00]/20">
            <Zap className="w-8 h-8 text-black" fill="currentColor" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white tracking-tight">BLACKBORZ</div>
            <div className="text-[#c8ff00] text-sm font-bold tracking-widest uppercase">{t.subtitle}</div>
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6">
          <h1 className="text-base font-bold text-white mb-1">{t.title}</h1>
          <p className="text-sm text-[#555] mb-6">{t.description}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-[#666] font-medium uppercase tracking-wide block mb-1.5">{t.emailLabel}</label>
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} className="w-full px-3 py-2.5 bg-[#141414] border border-[#242424] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c8ff00]/40 transition-colors" />
            </div>

            <div>
              <label className="text-xs text-[#666] font-medium uppercase tracking-wide block mb-1.5">{t.passwordLabel}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2.5 pr-10 bg-[#141414] border border-[#242424] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c8ff00]/40 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#c8ff00] hover:bg-[#b8ef00] text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t.signingIn : t.signIn}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#444] mt-4">
          {t.help}{' '}
          <a href="mailto:amaev.pro@gmail.com" className="text-[#c8ff00] hover:underline">
            {t.helpLink}
          </a>
        </p>
      </div>
    </div>
  );
}
