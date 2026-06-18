'use client';
import { useEffect } from 'react';
import { useLeadsStore } from '@/store/leadsStore';

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const { fetchLeads, loadMockData } = useLeadsStore();

  useEffect(() => {
    if (SUPABASE_CONFIGURED) {
      fetchLeads();
    } else {
      loadMockData();
    }
  }, [fetchLeads, loadMockData]);

  return <>{children}</>;
}
