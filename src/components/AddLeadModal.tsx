'use client';
import { useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { Lead, LeadStatus, LeadSource, LeadPriority } from '@/lib/types';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AddLeadModalProps {
  onClose: () => void;
}

export default function AddLeadModal({ onClose }: AddLeadModalProps) {
  const { addLead } = useLeadsStore();
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
    const now = new Date().toISOString();
    const lead: Lead = {
      id: uuidv4(),
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
      createdAt: now,
      updatedAt: now,
    };
    addLead(lead);
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
          <h2 className="text-base font-bold text-white">Новый лид</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Имя *</label>
              <input required className={inputClass} placeholder="Иван Иванов" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Компания *</label>
              <input required className={inputClass} placeholder="ООО Компания" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} placeholder="email@example.ru" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Телефон</label>
              <input className={inputClass} placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Статус</label>
              <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
                <option value="new">Новый</option>
                <option value="contacted">Контакт</option>
                <option value="qualified">Квалификация</option>
                <option value="proposal">Предложение</option>
                <option value="won">Выиграно</option>
                <option value="lost">Проиграно</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Источник</label>
              <select className={inputClass} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
                <option value="website">Сайт</option>
                <option value="referral">Рекомендация</option>
                <option value="social">Соцсети</option>
                <option value="cold_call">Холодный звонок</option>
                <option value="event">Мероприятие</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Приоритет</label>
              <select className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as LeadPriority })}>
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Ценность (₽)</label>
              <input type="number" className={inputClass} placeholder="500000" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Регион</label>
              <input className={inputClass} placeholder="Москва" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Теги (через запятую)</label>
            <input className={inputClass} placeholder="ритейл, HoReCa, Москва" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>

          <div>
            <label className={labelClass}>Заметки</label>
            <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Описание лида, контекст переговоров..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-[#2a2a2a] text-[#888] rounded-xl text-sm hover:text-white transition-all">
              Отмена
            </button>
            <button type="submit" className="flex-1 py-2 bg-[#c8ff00] text-black rounded-xl text-sm font-bold hover:bg-[#b8ef00] transition-all">
              Добавить лида
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
