import ComingSoon from '@/components/ComingSoon';
import { Briefcase } from 'lucide-react';

export default function DealsPage() {
  return (
    <ComingSoon
      icon={Briefcase}
      title="Сделки"
      description="Управление коммерческими предложениями и контрактами"
      features={[
        'Воронка сделок с прогнозом выручки',
        'Привязка к лидам, контактам, компаниям',
        'Загрузка КП и договоров',
        'Напоминания о дедлайнах',
        'Автоматический расчёт комиссии',
      ]}
    />
  );
}
