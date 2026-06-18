'use client';
import { useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { LeadStatus, LeadSource, LeadPriority } from '@/lib/types';
import { X } from 'lucide-react';
import { useT } from '@/lib/i18n/LanguageContext';

interface AddLeadModalProps {
  onClose: () => void;
}

export default function AddLeadModal({ onClose }: AddLeadModalProps) {
  const { addLead } = useLeadsStore();
  const { t } = useT();
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'new' as LeadStatus,
    source: 'website' as LeadSource,
    priority: 'medium' as LeadPriority,
    value: '',
    notes: '',
    region: '',
    tags: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addLead({
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      status: form.status,
      source: form.source,
      priority: form.priority,
      value: Number(form.value) || 0,
      notes: form.notes,
      region: form.region,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
    onClose();
  }

  const inputClass = "w-full px-3 py-2 bg-[#141414] border border-[#242424] rounded-xl text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#c8ff00]/40 transition-colors";
  const labelClass = "text-xs text-[#666] font-medium uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#0d0d0d] border border-[#242424] rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
          <h2 className="text-base font-bold text-white">{t('leads.addLead')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{t('leads.name')} *</label>
              <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t('leads.company')} *</label>
              <input required className={inputClass} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t('leads.email')}</label>
              <input type="email" className={inputClass} placeholder="email@example.ru" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t('leads.phone')}</label>
              <input className={inputClass} placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>{t('leads.status')}</label>
              <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
                <option value="new">{t('status.new')}</option>
                <option value="contacted">{t('status.contacted')}</option>
                <option value="qualified">{t('status.qualified')}</option>
                <option value="proposal">{t('status.proposal')}</option>
                <option value="won">{t('status.won')}</option>
                <option value="lost">{t('status.lost')}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t('leads.source')}</label>
              <select className={inputClass} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
                <option value="website">{t('source.website')}</option>
                <option value="referral">{t('source.referral')}</option>
                <option value="social">{t('source.social')}</option>
                <option value="cold_call">{t('source.cold_call')}</option>
                <option value="event">{t('source.event')}</option>
                <option value="other">{t('source.other')}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t('leads.priority')}</label>
              <select className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as LeadPriority })}>
                <option value="low">{t('priority.low')}</option>
                <option value="medium">{t('priority.medium')}</option>
                <option value="high">{t('priority.high')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{t('leads.value')}</label>
              <input type="number" className={inputClass} placeholder="500000" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t('leads.region')}</label>
              <input className={inputClass} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            </div>
          </div>

          <div>
            <label className={labelClass}>{t('leads.tags')}</label>
            <input className={inputClass} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>

          <div>
            <label className={labelClass}>{t('leads.notes')}</label>
            <textarea className={`${inputClass} resize-none`} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-[#2a2a2a] text-[#888] rounded-xl text-sm hover:text-white transition-all">
              {t('common.cancel')}
            </button>
            <button type="submit" className="flex-1 py-2 bg-[#c8ff00] text-black rounded-xl text-sm font-bold hover:bg-[#b8ef00] transition-all">
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
