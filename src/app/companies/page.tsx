'use client';
import EntityPage from '@/components/EntityPage';
import { ENTITIES } from '@/lib/entities';
import { Building2 } from 'lucide-react';

export default function CompaniesPage() {
  return <EntityPage type="companies" config={ENTITIES.companies} icon={Building2} />;
}
