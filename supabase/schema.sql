-- =====================================================
-- BLACKBORZ ENERGY CRM — Supabase Database Schema
-- Выполните этот SQL в Supabase → SQL Editor
-- =====================================================

-- Таблица лидов
CREATE TABLE IF NOT EXISTS public.leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  company       TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','contacted','qualified','proposal','won','lost')),
  source        TEXT NOT NULL DEFAULT 'other'
                  CHECK (source IN ('website','referral','social','cold_call','event','other')),
  priority      TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('low','medium','high')),
  value         NUMERIC NOT NULL DEFAULT 0,
  notes         TEXT DEFAULT '',
  tags          TEXT[] DEFAULT '{}',
  region        TEXT DEFAULT '',
  contact_person TEXT DEFAULT '',
  ai_score      INTEGER,
  ai_analysis   TEXT,
  ai_summary    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Автоматическое обновление updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security (только авторизованные пользователи)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can do everything"
  ON public.leads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Индексы для быстрой фильтрации
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

-- =====================================================
-- Тестовые данные (можно удалить в продакшене)
-- =====================================================
INSERT INTO public.leads (name, company, email, phone, status, source, priority, value, notes, tags, region) VALUES
  ('Алексей Петров',  'SportLife Gym Network',   'a.petrov@sportlife.ru',    '+7 (495) 123-45-67', 'new',       'website',   'high',   850000,  'Сеть 12 фитнес-клубов по Москве. Интересуют поставки для баров.',                              ARRAY['фитнес','HoReCa','Москва'],          'Москва'),
  ('Мария Соколова',  'ТЦ Мега Белая Дача',      'm.sokolova@mega.ru',        '+7 (495) 234-56-78', 'contacted', 'referral',  'high',   1200000, 'Менеджер по закупкам. Ищут энергетик для фудкортов ТЦ.',                                      ARRAY['ритейл','фудкорт','МО'],             'Московская область'),
  ('Игорь Васильев',  'Delivery Club Logistics',  'i.vasiliev@dc-log.ru',     '+7 (812) 345-67-89', 'qualified', 'event',     'medium', 2500000, 'Директор по закупкам. Познакомились на ProductEXPO 2026.',                                    ARRAY['корпоратив','логистика','СПБ'],       'Санкт-Петербург'),
  ('Дарья Новикова',  'X5 Retail Group',          'd.novikova@x5.ru',         '+7 (495) 456-78-90', 'proposal',  'cold_call', 'high',   5800000, 'Категорийный менеджер. Рассматривают листинг в Перекрёсток.',                                 ARRAY['ключевой','ритейл','федеральный'],    'Федеральный'),
  ('Сергей Кузнецов', 'Киберспорт Арена Pro',     's.kuznetsov@esports-arena.ru','+7 (495) 567-89-01','won',      'social',    'medium', 320000,  'Сеть киберспортивных арен. Контракт на 6 месяцев подписан.',                                  ARRAY['киберспорт','gaming','Москва'],       'Москва'),
  ('Анна Морозова',   'Premium Hotels Collection','a.morozova@phc.ru',        '+7 (495) 678-90-12', 'contacted', 'referral',  'medium', 680000,  'Сеть 4*-5* отелей. Размещение в минибарах и лобби-барах.',                                    ARRAY['HoReCa','отели','премиум'],           'Москва'),
  ('Павел Орлов',     'Festival Planet',          'p.orlov@festplanet.ru',    '+7 (903) 789-01-23', 'new',       'social',    'low',    450000,  'Организатор фестивалей. Партнёрство для летних мероприятий.',                                 ARRAY['события','фестиваль','BTL'],          'Россия'),
  ('Елена Смирнова',  'AutoDrive Fleet',          'e.smirnova@autodrive.ru',  '+7 (812) 890-12-34', 'lost',      'cold_call', 'low',    180000,  'Не прошли по цене. Клиент выбрал конкурента.',                                                ARRAY['авто','СПБ'],                         'Санкт-Петербург')
ON CONFLICT DO NOTHING;
