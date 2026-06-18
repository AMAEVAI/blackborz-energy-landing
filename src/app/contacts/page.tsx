import ComingSoon from '@/components/ComingSoon';
import { Contact } from 'lucide-react';

export default function ContactsPage() {
  return (
    <ComingSoon
      icon={Contact}
      title="Контакты"
      description="Управление контактными лицами клиентов"
      features={[
        'База контактов с историей взаимодействий',
        'Привязка к компаниям и сделкам',
        'История звонков, писем и встреч',
        'Импорт контактов из Excel / CSV',
        'Теги и сегментация контактов',
      ]}
    />
  );
}
