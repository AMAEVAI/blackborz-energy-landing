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
-- Таблица контактов
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT '',
  position   TEXT NOT NULL DEFAULT '',
  company    TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  notes      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_own" ON public.contacts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON public.contacts(created_at DESC);

-- =====================================================
-- Таблица компаний
-- =====================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT '',
  industry   TEXT NOT NULL DEFAULT '',
  website    TEXT NOT NULL DEFAULT '',
  region     TEXT NOT NULL DEFAULT '',
  notes      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_own" ON public.companies
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS companies_user_id_idx ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS companies_created_at_idx ON public.companies(created_at DESC);

-- =====================================================
-- Таблица сделок
-- =====================================================
CREATE TABLE IF NOT EXISTS public.deals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL DEFAULT '',
  value      NUMERIC NOT NULL DEFAULT 0,
  stage      TEXT NOT NULL DEFAULT 'lead'
               CHECK (stage IN ('lead','proposal','negotiation','won','lost')),
  company    TEXT NOT NULL DEFAULT '',
  contact    TEXT NOT NULL DEFAULT '',
  notes      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deals_own" ON public.deals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS deals_user_id_idx ON public.deals(user_id);
CREATE INDEX IF NOT EXISTS deals_created_at_idx ON public.deals(created_at DESC);

-- =====================================================
-- Таблица задач
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL DEFAULT '',
  due_date   DATE,
  status     TEXT NOT NULL DEFAULT 'todo'
               CHECK (status IN ('todo','in_progress','done')),
  priority   TEXT NOT NULL DEFAULT 'medium'
               CHECK (priority IN ('low','medium','high')),
  notes      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_own" ON public.tasks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at DESC);

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
  ('Елена Смирнова',  'AutoDrive Fleet',          'e.smirnova@autodrive.ru',  '+7 (812) 890-12-34', 'lost',      'cold_call', 'low',    180000,  'Не прошли по цене. Клиент выбрал конкурента.',                                                                ARRAY['авто','СПБ'],                         'Санкт-Петербург')
ON CONFLICT DO NOTHING;
