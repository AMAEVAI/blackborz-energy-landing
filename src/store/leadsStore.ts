'use client';
import { create } from 'zustand';
import { Lead, LeadStatus } from '@/lib/types';

// Map DB snake_case row → Lead camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    status: row.status,
    source: row.source,
    priority: row.priority,
    value: row.value,
    notes: row.notes,
    tags: row.tags || [],
    region: row.region,
    contactPerson: row.contact_person,
    aiScore: row.ai_score,
    aiAnalysis: row.ai_analysis,
    aiSummary: row.ai_summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  isAnalyzing: boolean;
  isSummarizing: boolean;
  isLoading: boolean;
  searchQuery: string;

  fetchLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  moveLead: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  setSelectedLead: (lead: Lead | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setIsSummarizing: (v: boolean) => void;
  setSearchQuery: (q: string) => void;

  getLeadsByStatus: (status: LeadStatus) => Lead[];
  getStats: () => {
    totalLeads: number;
    newLeads: number;
    wonDeals: number;
    totalValue: number;
    conversionRate: number;
    avgDealValue: number;
  };
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  selectedLead: null,
  isAnalyzing: false,
  isSummarizing: false,
  isLoading: false,
  searchQuery: '',

  fetchLeads: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('Failed to fetch');
      const rows = await res.json();
      set({ leads: rows.map(rowToLead) });
    } finally {
      set({ isLoading: false });
    }
  },

  addLead: async (lead) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) return;
    const row = await res.json();
    set((s) => ({ leads: [rowToLead(row), ...s.leads] }));
  },

  updateLead: async (id, updates) => {
    // Optimistic update
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      selectedLead: s.selectedLead?.id === id ? { ...s.selectedLead, ...updates } : s.selectedLead,
    }));
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  deleteLead: async (id) => {
    set((s) => ({
      leads: s.leads.filter((l) => l.id !== id),
      selectedLead: s.selectedLead?.id === id ? null : s.selectedLead,
    }));
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
  },

  moveLead: async (leadId, newStatus) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId ? { ...l, status: newStatus } : l
      ),
    }));
    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  },

  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setIsSummarizing: (v) => set({ isSummarizing: v }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  getLeadsByStatus: (status) => {
    const { leads, searchQuery } = get();
    return leads
      .filter((l) => l.status === status)
      .filter(
        (l) =>
          !searchQuery ||
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
  },

  getStats: () => {
    const { leads } = get();
    const won = leads.filter((l) => l.status === 'won');
    const totalValue = won.reduce((sum, l) => sum + l.value, 0);
    const closed = leads.filter((l) => l.status === 'won' || l.status === 'lost').length;
    return {
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.status === 'new').length,
      wonDeals: won.length,
      totalValue,
      conversionRate: closed > 0 ? Math.round((won.length / closed) * 100) : 0,
      avgDealValue: won.length > 0 ? Math.round(totalValue / won.length) : 0,
    };
  },
}));
