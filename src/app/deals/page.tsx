'use client';
import EntityPage from '@/components/EntityPage';
import { ENTITIES } from '@/lib/entities';
import { Briefcase } from 'lucide-react';

export default function DealsPage() {
  return <EntityPage type="deals" config={ENTITIES.deals} icon={Briefcase} />;
}
