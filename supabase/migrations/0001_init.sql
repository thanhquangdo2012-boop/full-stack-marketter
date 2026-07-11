-- Full-stack Marketer — initial schema
-- Xem CLAUDE.md mục 7 (Mô hình dữ liệu) và 12-NGUYEN-TAC-BAO-MAT.md RULE-10.
--
-- Nguyên tắc: mọi ghi/đọc nhạy cảm đi qua API route (Next.js) dùng
-- SUPABASE_SERVICE_ROLE_KEY, không bao giờ dùng anon key ở phía browser để
-- đọc/ghi trực tiếp các bảng dưới đây. RLS bật trên mọi bảng, không có policy
-- cho anon/authenticated => service_role (bỏ qua RLS) là đường duy nhất ghi
-- dữ liệu thật, đúng RULE-03.

create extension if not exists "pgcrypto";

-- ============================================================
-- members
-- ============================================================
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null unique,
  email text not null unique,
  password_hash text not null,
  tier text not null default 'free' check (tier in ('free', 'mvp2', 'mvp3', 'mvp4')),
  must_change_password boolean not null default true,
  interested_product text check (interested_product in ('mvp2', 'mvp3', 'mvp4')),
  created_at timestamptz not null default now()
);

alter table members enable row level security;
-- Không có policy nào cho anon/authenticated => chỉ service_role (server) đọc/ghi được.

-- View công khai tối thiểu, phòng trường hợp cần đọc qua anon key sau này.
-- KHÔNG chứa phone/email/password_hash.
create or replace view members_public as
  select id, tier, created_at
  from members;

-- ============================================================
-- orders — luồng thanh toán thủ công (chuyển khoản + admin xác nhận)
-- ============================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique, -- vd: FSM-A1B2C3
  member_id uuid not null references members(id) on delete cascade,
  product text not null check (product in ('mvp2', 'mvp3', 'mvp4')),
  amount integer not null, -- VND
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'cancelled')),
  bank_transfer_note text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmed_by text
);

alter table orders enable row level security;

create index if not exists orders_member_id_idx on orders(member_id);
create index if not exists orders_status_idx on orders(status);

-- ============================================================
-- quiz_results — quiz chẩn đoán MVP3 (xem CLAUDE.md mục 6)
-- ============================================================
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  answers jsonb not null,
  recommended_tracks jsonb not null,
  created_at timestamptz not null default now()
);

alter table quiz_results enable row level security;

create index if not exists quiz_results_member_id_idx on quiz_results(member_id);

-- ============================================================
-- content_items — nội dung khoá theo tier (nguồn học, tiêu chí tự đánh giá,
-- checklist, mẫu tờ trình...)
-- ============================================================
create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  content_type text not null check (content_type in ('template', 'source_list', 'self_check', 'checklist')),
  required_tier text not null check (required_tier in ('free', 'mvp2', 'mvp3', 'mvp4')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table content_items enable row level security;

create index if not exists content_items_required_tier_idx on content_items(required_tier);
