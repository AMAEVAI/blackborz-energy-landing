'use client';
import { useEffect } from 'react';
import { useLeadsStore } from '@/store/leadsStore';

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const fetchLeads = useLeadsStore((s) => s.fetchLeads);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return <>{children}</>;
}
