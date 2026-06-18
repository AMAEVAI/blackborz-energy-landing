import ComingSoon from '@/components/ComingSoon';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <ComingSoon
      icon={CheckSquare}
      title="Задачи"
      description="Планирование и контроль задач по клиентам"
      features={[
        'Создание задач с дедлайнами',
        'Привязка задачи к лиду или сделке',
        'Назначение ответственного менеджера',
        'Уведомления о просроченных задачах',
        'Фильтры: мои задачи, просроченные, сегодня',
      ]}
    />
  );
}
