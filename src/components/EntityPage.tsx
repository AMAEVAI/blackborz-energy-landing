'use client';
import { useEffect, useState, useCallback } from 'react';
import { LucideIcon, Plus, Trash2, X, Loader2, Search } from 'lucide-react';
import { EntityConfig } from '@/lib/entities';
import { useT } from '@/lib/i18n/LanguageContext';

interface Row {
  id: string;
  [key: string]: unknown;
}

export default function EntityPage({ type, config, icon: Icon }: { type: string; config: EntityConfig; icon: LucideIcon }) {
  const { t } = useT();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/entities/${type}`);
      if (res.ok) {
        setRows(await res.json());
      } else {
        const d = await res.json().catch(() => ({}));
        setLoadError(d.error || 'Таблица не найдена в Supabase. Запустите SQL из инструкции.');
      }
    } catch {
      setLoadError('Ошибка подключения к базе данных.');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm(t('common.confirmDelete'))) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/entities/${type}/${id}`, { method: 'DELETE' });
  }

  const tableFields = config.fields.filter((f) => f.showInTable);

  function renderCell(row: Row, key: string) {
    const field = config.fields.find((f) => f.key === key);
    const val = row[key];
    if (val === null || val === undefined || val === '') return <span className="text-[#444]">—</span>;
    if (field?.type === 'select') {
      const opt = field.options?.find((o) => o.value === val);
      return opt ? t(opt.labelKey) : String(val);
    }
    if (field?.type === 'number') return Number(val).toLocaleString('ru-RU');
    return String(val);
  }

  const filtered = rows.filter((row) => {
    if (!search) return true;
    return tableFields.some((f) => String(row[f.key] ?? '').toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 text-[#c8ff00]" />
            <span className="text-xs text-[#c8ff00] font-bold uppercase tracking-widest">BLACKBORZ CRM</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">{t(config.titleKey)}</h1>
          <p className="text-[#666] text-xs md:text-sm mt-0.5">{t(config.subtitleKey)}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-[#c8ff00] hover:bg-[#b8ef00] text-black rounded-xl text-sm font-bold transition-all flex-shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">{t(config.addKey)}</span>
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('common.search')} className="w-full md:max-w-xs pl-9 pr-3 py-2 bg-[#141414] border border-[#242424] rounded-xl text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#c8ff00]/40 transition-colors" />
      </div>

      {loadError && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0">⚠</span>
          <span>{loadError}</span>
        </div>
      )}

      <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-[#666]">
            <Loader2 className="w-5 h-5 animate-spin text-[#c8ff00]" />
            <span className="text-sm">{t('common.loading')}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon className="w-12 h-12 text-[#2a2a2a] mb-3" />
            <p className="text-[#555] text-sm">{t('common.empty')}</p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden divide-y divide-[#1a1a1a]">
              {filtered.map((row) => (
                <div key={row.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    {tableFields.map((f, i) => (
                      <div key={f.key} className={i === 0 ? 'font-semibold text-white text-sm truncate' : 'text-xs text-[#666] truncate'}>
                        {i > 0 && <span className="text-[#444]">{t(f.labelKey)}: </span>}
                        {renderCell(row, f.key)}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e1e1e]">
                    {tableFields.map((f) => (
                      <th key={f.key} className="text-left px-5 py-3 text-xs text-[#666] font-medium uppercase tracking-wide whitespace-nowrap">{t(f.labelKey)}</th>
                    ))}
                    <th className="px-5 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                      {tableFields.map((f) => (
                        <td key={f.key} className="px-5 py-3.5 text-[#ccc] whitespace-nowrap">{renderCell(row, f.key)}</td>
                      ))}
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <EntityModal
          type={type}
          config={config}
          onClose={() => setShowModal(false)}
          onCreated={(row) => { setRows((r) => [row, ...r]); setShowModal(false); }}
        />
      )}
    </div>
  );
}

function EntityModal({ type, config, onClose, onCreated }: { type: string; config: EntityConfig; onClose: () => void; onCreated: (row: Row) => void }) {
  const { t } = useT();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/entities/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения. Проверьте настройки Supabase.');
        return;
      }
      onCreated(data);
    } catch {
      setError('Ошибка сети. Проверьте подключение.');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full px-3 py-2 bg-[#141414] border border-[#242424] rounded-xl text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#c8ff00]/40 transition-colors';
  const labelClass = 'text-xs text-[#666] font-medium uppercase tracking-wide mb-1 block';

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#0d0d0d] border border-[#242424] rounded-t-2xl md:rounded-2xl w-full md:max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
          <h2 className="text-base font-bold text-white">{t(config.addKey)}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && (
          <div className="mx-5 mt-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-start gap-2">
            <span className="mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {config.fields.map((f) => (
            <div key={f.key}>
              <label className={labelClass}>{t(f.labelKey)}{f.required && ' *'}</label>
              {f.type === 'textarea' ? (
                <textarea className={`${inputClass} resize-none`} rows={3} value={form[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} />
              ) : f.type === 'select' ? (
                <select className={inputClass} value={form[f.key] || f.options?.[0].value || ''} onChange={(e) => set(f.key, e.target.value)}>
                  {f.options?.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
                </select>
              ) : (
                <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'email' ? 'email' : 'text'} required={f.required} className={inputClass} value={form[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-[#2a2a2a] text-[#888] rounded-xl text-sm hover:text-white transition-all">{t('common.cancel')}</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-[#c8ff00] text-black rounded-xl text-sm font-bold hover:bg-[#b8ef00] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
