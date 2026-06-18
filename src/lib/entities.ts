export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'date' | 'select';

export interface EntityField {
  key: string;
  labelKey: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; labelKey: string }[];
  showInTable?: boolean;
}

export interface EntityConfig {
  table: string;
  titleKey: string;
  subtitleKey: string;
  addKey: string;
  fields: EntityField[];
}

export const ENTITIES: Record<string, EntityConfig> = {
  contacts: {
    table: 'contacts',
    titleKey: 'contacts.title',
    subtitleKey: 'contacts.subtitle',
    addKey: 'contacts.add',
    fields: [
      { key: 'name', labelKey: 'field.name', type: 'text', required: true, showInTable: true },
      { key: 'position', labelKey: 'field.position', type: 'text', showInTable: true },
      { key: 'company', labelKey: 'field.company', type: 'text', showInTable: true },
      { key: 'email', labelKey: 'field.email', type: 'email', showInTable: true },
      { key: 'phone', labelKey: 'field.phone', type: 'tel', showInTable: true },
      { key: 'notes', labelKey: 'field.notes', type: 'textarea' },
    ],
  },
  companies: {
    table: 'companies',
    titleKey: 'companies.title',
    subtitleKey: 'companies.subtitle',
    addKey: 'companies.add',
    fields: [
      { key: 'name', labelKey: 'field.name', type: 'text', required: true, showInTable: true },
      { key: 'industry', labelKey: 'field.industry', type: 'text', showInTable: true },
      { key: 'website', labelKey: 'field.website', type: 'text', showInTable: true },
      { key: 'region', labelKey: 'field.region', type: 'text', showInTable: true },
      { key: 'notes', labelKey: 'field.notes', type: 'textarea' },
    ],
  },
  deals: {
    table: 'deals',
    titleKey: 'deals.title',
    subtitleKey: 'deals.subtitle',
    addKey: 'deals.add',
    fields: [
      { key: 'title', labelKey: 'field.title', type: 'text', required: true, showInTable: true },
      { key: 'value', labelKey: 'field.value', type: 'number', showInTable: true },
      {
        key: 'stage', labelKey: 'field.stage', type: 'select', showInTable: true,
        options: [
          { value: 'lead', labelKey: 'stage.lead' },
          { value: 'proposal', labelKey: 'stage.proposal' },
          { value: 'negotiation', labelKey: 'stage.negotiation' },
          { value: 'won', labelKey: 'stage.won' },
          { value: 'lost', labelKey: 'stage.lost' },
        ],
      },
      { key: 'company', labelKey: 'field.company', type: 'text', showInTable: true },
      { key: 'contact', labelKey: 'field.contact', type: 'text', showInTable: true },
      { key: 'notes', labelKey: 'field.notes', type: 'textarea' },
    ],
  },
  tasks: {
    table: 'tasks',
    titleKey: 'tasks.title',
    subtitleKey: 'tasks.subtitle',
    addKey: 'tasks.add',
    fields: [
      { key: 'title', labelKey: 'field.title', type: 'text', required: true, showInTable: true },
      { key: 'due_date', labelKey: 'field.dueDate', type: 'date', showInTable: true },
      {
        key: 'status', labelKey: 'field.taskStatus', type: 'select', showInTable: true,
        options: [
          { value: 'todo', labelKey: 'taskStatus.todo' },
          { value: 'in_progress', labelKey: 'taskStatus.in_progress' },
          { value: 'done', labelKey: 'taskStatus.done' },
        ],
      },
      {
        key: 'priority', labelKey: 'leads.priority', type: 'select', showInTable: true,
        options: [
          { value: 'low', labelKey: 'priority.low' },
          { value: 'medium', labelKey: 'priority.medium' },
          { value: 'high', labelKey: 'priority.high' },
        ],
      },
      { key: 'notes', labelKey: 'field.notes', type: 'textarea' },
    ],
  },
};

export function getEntityConfig(type: string): EntityConfig | null {
  return ENTITIES[type] ?? null;
}
