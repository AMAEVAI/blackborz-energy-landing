import ComingSoon from '@/components/ComingSoon';
import { Building2 } from 'lucide-react';

export default function CompaniesPage() {
  return (
    <ComingSoon
      icon={Building2}
      title="Компании"
      description="Справочник организаций и партнёров"
      features={[
        'Карточка компании с реквизитами',
        'Привязанные контакты и сделки',
        'История взаимодействий с компанией',
        'Категории: дистрибьютор, ритейл, HoReCa',
        'Финансовая аналитика по клиенту',
      ]}
    />
  );
}
