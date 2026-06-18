'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { Lang, LANGS, loginText } from '@/lib/i18n/login';
import NeuralBackground from '@/components/NeuralBackground';
import { PixelLogoGrid } from '@/components/ui/pixel-logo-grid';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);
  const [lang, setLang] = useState<Lang>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved && ['ru', 'fr', 'en'].includes(saved)) setLang(saved);
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    localStorage.setItem('lang', l);
  }

  function switchMode(m: 'login' | 'register') {
    setMode(m);
    setError('');
    setSuccess('');
  }

  const t = loginText[lang];
  const isRegister = mode === 'register';

  // 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    const supabase = createClient();

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(error.message || t.registerError);
        setIsLoading(false);
        return;
      }
      if (data.session) {
        router.push('/dashboard');
        router.refresh();
        return;
      }
      setSuccess(t.checkEmail);
      setIsLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(t.error);
        setIsLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex flex-col items-center justify-center py-8 gap-8">
      {/* Neural particle background */}
      <div className="absolute inset-0">
        <NeuralBackground color="#c8ff00" trailOpacity={0.12} particleCount={600} speed={0.8} />
      </div>

      {/* Dark overlay to keep card readable */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#c8ff00]/8 blur-[100px]" />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#c8ff00]/10 blur-[60px]"
        animate={{ opacity: [0.1, 0.25, 0.1], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#c8ff00]/10 blur-[60px]"
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', delay: 1 }}
      />
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-[#c8ff00]/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-[#c8ff00]/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

      {/* Language switcher */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-1">
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => changeLang(code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              lang === code ? 'bg-[#c8ff00] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 px-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Card glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  '0 0 10px 2px rgba(200,255,0,0.05)',
                  '0 0 15px 5px rgba(200,255,0,0.08)',
                  '0 0 10px 2px rgba(200,255,0,0.05)',
                ],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            />

            {/* Traveling light beams */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-[#c8ff00] to-transparent opacity-70"
                initial={{ filter: 'blur(2px)' }}
                animate={{ left: ['-50%', '100%'], opacity: [0.3, 0.7, 0.3], filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)'] }}
                transition={{
                  left: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror' },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror' },
                }}
              />
              <motion.div
                className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-[#c8ff00] to-transparent opacity-70"
                initial={{ filter: 'blur(2px)' }}
                animate={{ top: ['-50%', '100%'], opacity: [0.3, 0.7, 0.3], filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)'] }}
                transition={{
                  top: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 0.6 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror', delay: 0.6 },
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-[#c8ff00] to-transparent opacity-70"
                initial={{ filter: 'blur(2px)' }}
                animate={{ right: ['-50%', '100%'], opacity: [0.3, 0.7, 0.3], filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)'] }}
                transition={{
                  right: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.2 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror', delay: 1.2 },
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-[#c8ff00] to-transparent opacity-70"
                initial={{ filter: 'blur(2px)' }}
                animate={{ bottom: ['-50%', '100%'], opacity: [0.3, 0.7, 0.3], filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)'] }}
                transition={{
                  bottom: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.8 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror', delay: 1.8 },
                }}
              />
            </div>

            {/* Glass card */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-2xl overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px',
                }}
              />

              {/* Logo + header */}
              <div className="text-center space-y-1 mb-5 relative z-10">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="mx-auto w-12 h-12 rounded-2xl bg-[#c8ff00] flex items-center justify-center relative overflow-hidden shadow-lg shadow-[#c8ff00]/20"
                >
                  <Zap className="w-7 h-7 text-black" fill="currentColor" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-2"
                >
                  <div className="text-xl font-black tracking-tight text-white">BLACKBORZ</div>
                  <div className="text-[#c8ff00] text-xs font-bold tracking-widest uppercase">{t.subtitle}</div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs pt-1"
                >
                  {isRegister ? t.registerDescription : t.description}
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="space-y-3">
                  {/* Email */}
                  <motion.div className={`relative ${focusedInput === 'email' ? 'z-10' : ''}`} whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === 'email' ? 'text-[#c8ff00]' : 'text-white/40'}`} />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border border-transparent focus:border-[#c8ff00]/40 text-white placeholder:text-white/30 h-10 rounded-lg transition-all duration-300 pl-10 pr-3 focus:bg-white/10 outline-none text-sm"
                      />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div className={`relative ${focusedInput === 'password' ? 'z-10' : ''}`} whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === 'password' ? 'text-[#c8ff00]' : 'text-white/40'}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        placeholder={t.passwordLabel}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border border-transparent focus:border-[#c8ff00]/40 text-white placeholder:text-white/30 h-10 rounded-lg transition-all duration-300 pl-10 pr-10 focus:bg-white/10 outline-none text-sm"
                      />
                      <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer">
                        {showPassword ? (
                          <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        )}
                      </div>
                    </div>
                    {isRegister && <p className="text-xs text-white/40 mt-1.5 pl-1">{t.passwordHint}</p>}
                  </motion.div>
                </div>

                {error && <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">{error}</div>}
                {success && (
                  <div className="px-3 py-2.5 bg-[#c8ff00]/10 border border-[#c8ff00]/20 rounded-lg text-xs text-[#c8ff00] flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full relative group/button mt-2">
                  <div className="absolute inset-0 bg-[#c8ff00]/30 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                  <div className="relative overflow-hidden bg-[#c8ff00] text-black font-bold h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1 text-sm font-bold">
                          {isRegister ? t.registerCta : t.signIn}
                          <ArrowRight className="w-3.5 h-3.5 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Mode toggle */}
                <div className="text-center text-xs text-white/50 pt-1">
                  {isRegister ? (
                    <>
                      {t.toLogin}{' '}
                      <button type="button" onClick={() => switchMode('login')} className="text-[#c8ff00] font-medium hover:underline">
                        {t.toLoginLink}
                      </button>
                    </>
                  ) : (
                    <>
                      {t.toRegister}{' '}
                      <button type="button" onClick={() => switchMode('register')} className="text-[#c8ff00] font-medium hover:underline">
                        {t.toRegisterLink}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-white/40 mt-5">
          {t.help}{' '}
          <a href="mailto:amaev.pro@gmail.com" className="text-[#c8ff00] hover:underline">
            {t.helpLink}
          </a>
        </p>
      </motion.div>

      {/* Partners / clients section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 w-full max-w-2xl px-4"
      >
        <PixelLogoGrid />
      </motion.div>
    </div>
  );
}
