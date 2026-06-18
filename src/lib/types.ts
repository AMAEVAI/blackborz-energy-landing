export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'social' | 'cold_call' | 'event' | 'other';

export type LeadPriority = 'low' | 'medium' | 'high';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  value: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  aiScore?: number;
  aiAnalysis?: string;
  aiSummary?: string;
  tags: string[];
  contactPerson?: string;
  region?: string;
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
  leads: Lead[];
}

export interface AIAnalysisResult {
  score: number;
  potential: 'low' | 'medium' | 'high' | 'very_high';
  strengths: string[];
  risks: string[];
  nextSteps: string[];
  summary: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  wonDeals: number;
  totalValue: number;
  conversionRate: number;
  avgDealValue: number;
}
