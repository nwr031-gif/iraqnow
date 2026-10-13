-- ═══════════════════════════════════════════════════════════
-- ترقية نموذج الخبر — العراق الآن (v2)
-- نفّذ هذا الملف في: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════

alter table articles add column if not exists source text default '';
alter table articles add column if not exists source_url text default '';
alter table articles add column if not exists image_alt text default '';
alter table articles add column if not exists correction_note text default '';
alter table articles add column if not exists country text default '';
alter table articles add column if not exists is_opinion boolean default false;
alter table articles add column if not exists publish_at timestamptz;

-- جدول سجل التدقيق للإدارة
create table if not exists audit_log (
  id text primary key,
  action text not null,
  entity text not null,
  entity_id text,
  actor text default 'admin',
  details jsonb default '{}',
  created_at timestamptz default now()
);
create policy "public read audit" on audit_log for select using (true);
create policy "public write audit" on audit_log for all using (true) with check (true);

-- جدول أرسل خبراً
create table if not exists news_tips (
  id text primary key,
  name text default '',
  contact text default '',
  body text not null,
  status text default 'NEW',
  created_at timestamptz default now()
);
create policy "public read tips" on news_tips for select using (true);
create policy "public write tips" on news_tips for all using (true) with check (true);

-- مزامنة أسماء المصادر في المقالات الموجودة (استخراج من النص)
-- ملاحظة: المقالات القديمة تحمل المصدر داخل content_ar — يُحدَّث تدريجياً
