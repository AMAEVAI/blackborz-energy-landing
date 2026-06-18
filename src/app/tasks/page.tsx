'use client';
import EntityPage from '@/components/EntityPage';
import { ENTITIES } from '@/lib/entities';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return <EntityPage type="tasks" config={ENTITIES.tasks} icon={CheckSquare} />;
}
