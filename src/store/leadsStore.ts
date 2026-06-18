'use client';
import { create } from 'zustand';
import { Lead, LeadStatus } from '@/lib/types';
import { mockLeads } from '@/lib/mockData';

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  isAnalyzing: boolean;
  isSummarizing: boolean;
  searchQuery: string;
  filterStatus: LeadStatus | 'all';

  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLead: (leadId: string, newStatus: LeadStatus) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setIsSummarizing: (v: boolean) => void;
  setSearchQuery: (q: string) => void;
  setFilterStatus: (s: LeadStatus | 'all') => void;

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
  leads: mockLeads,
  selectedLead: null,
  isAnalyzing: false,
  isSummarizing: false,
  searchQuery: '',
  filterStatus: 'all',

  setLeads: (leads) => set({ leads }),
  addLead: (lead) => set((s) => ({ leads: [...s.leads, lead] })),
  updateLead: (id, updates) =>
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
      ),
      selectedLead:
        s.selectedLead?.id === id
          ? { ...s.selectedLead, ...updates, updatedAt: new Date().toISOString() }
          : s.selectedLead,
    })),
  deleteLead: (id) =>
    set((s) => ({
      leads: s.leads.filter((l) => l.id !== id),
      selectedLead: s.selectedLead?.id === id ? null : s.selectedLead,
    })),
  moveLead: (leadId, newStatus) =>
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? { ...l, status: newStatus, updatedAt: new Date().toISOString() }
          : l
      ),
    })),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setIsSummarizing: (v) => set({ isSummarizing: v }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterStatus: (s) => set({ filterStatus: s }),

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
    const newLeads = leads.filter((l) => l.status === 'new').length;
    const closedLeads = leads.filter(
      (l) => l.status === 'won' || l.status === 'lost'
    ).length;
    return {
      totalLeads: leads.length,
      newLeads,
      wonDeals: won.length,
      totalValue,
      conversionRate: closedLeads > 0 ? Math.round((won.length / closedLeads) * 100) : 0,
      avgDealValue: won.length > 0 ? Math.round(totalValue / won.length) : 0,
    };
  },
}));
