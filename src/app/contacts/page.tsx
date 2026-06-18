'use client';
import EntityPage from '@/components/EntityPage';
import { ENTITIES } from '@/lib/entities';
import { Contact } from 'lucide-react';

export default function ContactsPage() {
  return <EntityPage type="contacts" config={ENTITIES.contacts} icon={Contact} />;
}
