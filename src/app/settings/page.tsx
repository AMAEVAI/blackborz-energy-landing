'use client';
import { useState } from 'react';
import { Settings, Key, CheckCircle } from 'lucide-react';
import { useT } from '@/lib/i18n/LanguageContext';

export default function SettingsPage() {
  const { t } = useT();
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">{t('settings.system')}</span>
        </div>
        <h1 className="text-3xl font-black text-white">{t('settings.title')}</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#888]" />
              <h2 className="text-sm font-semibold text-white">{t('settings.apiKeys')}</h2>
            </div>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="text-xs text-[#666] font-medium uppercase tracking-wide mb-2 block">Anthropic API Key</label>
              <input type="password" className="w-full px-3 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c8ff00]/40 transition-colors font-mono" placeholder="sk-ant-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <p className="text-xs text-[#555] mt-2">
                {t('settings.apiKeyHint')} <code className="text-[#888]">ANTHROPIC_API_KEY</code>.
              </p>
            </div>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#c8ff00] hover:bg-[#b8ef00] text-black rounded-xl text-sm font-bold transition-all">
              {saved ? <CheckCircle className="w-4 h-4" /> : null}
              {saved ? t('settings.saved') : t('common.save')}
            </button>
          </form>
        </div>

        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">{t('settings.about')}</h2>
          <div className="space-y-2 text-sm text-[#666]">
            <div className="flex justify-between"><span>{t('settings.version')}</span><span className="text-[#888]">1.0.0</span></div>
            <div className="flex justify-between"><span>{t('settings.aiModel')}</span><span className="text-[#888]">Claude Haiku</span></div>
            <div className="flex justify-between"><span>{t('settings.company')}</span><span className="text-[#888]">AMAEV PRO</span></div>
            <div className="flex justify-between"><span>{t('settings.base')}</span><span className="text-[#888]">BLACKBORZ CRM</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
