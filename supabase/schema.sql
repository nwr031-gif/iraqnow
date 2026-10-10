-- ═══════════════════════════════════════════════════════════
-- العراق الآن | Iraq Now — مخطط قاعدة البيانات Supabase
-- انسخ هذا الملف كاملاً والصقه في: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════

-- المقالات
create table if not exists articles (
  id text primary key,
  slug text unique,
  status text default 'DRAFT',
  breaking boolean default false,
  featured boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  view_count int default 0,
  reading_time int default 5,
  author_id text,
  author_name text,
  category_slug text,
  governorate_slug text,
  image text,
  gallery jsonb default '[]',
  tags jsonb default '[]',
  title_ar text, title_ku text, title_en text,
  excerpt_ar text, excerpt_ku text, excerpt_en text,
  content_ar text, content_ku text, content_en text
);

-- الأقسام
create table if not exists categories (
  id text primary key,
  slug text unique,
  sort_order int default 0,
  name_ar text, name_ku text, name_en text,
  description_ar text, description_ku text, description_en text
);

-- فريق التحرير
create table if not exists authors (
  id text primary key,
  name text,
  slug text unique,
  email text unique,
  role text default 'JOURNALIST',
  avatar text,
  cover_image text,
  job_title text,
  bio text,
  twitter text, linkedin text, instagram text, website text,
  specialties jsonb default '[]',
  staff_since timestamptz default now(),
  is_active boolean default true,
  article_count int default 0,
  password_hash text,
  created_at timestamptz default now()
);

-- حلقات البودكاست
create table if not exists podcast_episodes (
  id text primary key,
  slug text unique,
  episode_number int default 1,
  season int default 1,
  duration text default '0:00',
  audio_url text,
  cover_url text,
  published_at timestamptz default now(),
  is_published boolean default true,
  is_featured boolean default false,
  views int default 0,
  title_ar text, title_ku text, title_en text,
  description_ar text, description_ku text, description_en text,
  guest_ar text, guest_ku text, guest_en text,
  show_notes_ar text, show_notes_ku text, show_notes_en text
);

-- التعليقات
create table if not exists comments (
  id text primary key,
  article_id text,
  article_title text,
  user_id text,
  user_name text default 'زائر',
  content text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- مشتركو النشرة البريدية
create table if not exists newsletter_subscribers (
  id text primary key,
  email text unique,
  locale text default 'ar',
  active boolean default true,
  created_at timestamptz default now()
);

-- إعدادات الموقع
create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- الفهارس
create index if not exists idx_articles_status on articles(status, published_at);
create index if not exists idx_articles_category on articles(category_slug);
create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_comments_status on comments(status);
create index if not exists idx_authors_slug on authors(slug);

-- ═══════════════════════════════════════════════════════════
-- ملاحظة مهمة حول الصلاحيات (RLS):
-- الجداول أدناه بدون RLS حتى يعمل الحفظ عبر مفتاح النشر مباشرة.
-- ⚠️ للإنتاج: فعّل RLS وأضف سياسات based on auth.
-- ═══════════════════════════════════════════════════════════

alter table articles enable row level security;
alter table categories enable row level security;
alter table authors enable row level security;
alter table podcast_episodes enable row level security;
alter table comments enable row level security;
alter table newsletter_subscribers enable row level security;
alter table site_settings enable row level security;

-- سياسات عامة (وضع تجريبي: القراءة والكتابة للجميع عبر مفتاح النشر)
-- فعّل هذه السياسات لتتمكن لوحة التحكم من الحفظ:
create policy "public read articles" on articles for select using (true);
create policy "public write articles" on articles for all using (true) with check (true);

create policy "public read categories" on categories for select using (true);
create policy "public write categories" on categories for all using (true) with check (true);

create policy "public read authors" on authors for select using (true);
create policy "public write authors" on authors for all using (true) with check (true);

create policy "public read podcasts" on podcast_episodes for select using (true);
create policy "public write podcasts" on podcast_episodes for all using (true) with check (true);

create policy "public read comments" on comments for select using (true);
create policy "public write comments" on comments for all using (true) with check (true);

create policy "public read subscribers" on newsletter_subscribers for select using (true);
create policy "public write subscribers" on newsletter_subscribers for all using (true) with check (true);

create policy "public read settings" on site_settings for select using (true);
create policy "public write settings" on site_settings for all using (true) with check (true);
