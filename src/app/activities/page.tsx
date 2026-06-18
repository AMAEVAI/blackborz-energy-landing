import ComingSoon from '@/components/ComingSoon';
import { Activity } from 'lucide-react';

export default function ActivitiesPage() {
  return (
    <ComingSoon
      icon={Activity}
      title="Активности"
      description="Лента всех взаимодействий с клиентами"
      features={[
        'История звонков, встреч, писем',
        'Логирование действий менеджеров',
        'Запись результатов переговоров',
        'Фильтрация по типу и дате',
        'Экспорт активностей в отчёт',
      ]}
    />
  );
}
