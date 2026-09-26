-- ========================================================
-- Supabase Schema for Team Chihuahua Store / CatalogCraft
-- Paste this entire script into your Supabase SQL Editor and click RUN
-- ========================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Store Settings Table
create table if not exists public.store_settings (
  id text primary key default 'settings_principal',
  seller_id text not null default 'bdy3TcO5IAOpmkQEy8zLGpEkENG3',
  store_name text not null default 'Team Chihuahua',
  store_tagline text default 'Tu tienda de encargos',
  store_logo text default '/logo_chihuahua.jpg',
  store_phone text default '+584142947512',
  currency_symbol text default '$',
  delivery_notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Catalogs Table
create table if not exists public.catalogs (
  id text primary key default 'cat_principal',
  seller_id text not null default 'bdy3TcO5IAOpmkQEy8zLGpEkENG3',
  title text not null default 'Colección Destacada 2026',
  description text default '',
  products jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Customer Profiles Table
create table if not exists public.customers (
  id text primary key,
  username text not null,
  full_name text default '',
  phone text default '',
  address text default '',
  city text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Orders Table
create table if not exists public.orders (
  id text primary key,
  customer_id text,
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'pending',
  notes text,
  created_at timestamptz default now()
);

-- ========================================================
-- Storage Bucket for Product High-Res Photos (CDN)
-- ========================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- ========================================================
-- Row Level Security (RLS) Policies
-- Public access for catalog reading & ordering
-- ========================================================

alter table public.store_settings enable row level security;
alter table public.catalogs enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;

-- Drop existing policies if any
drop policy if exists "Public store settings read" on public.store_settings;
drop policy if exists "Public store settings write" on public.store_settings;
drop policy if exists "Public catalogs read" on public.catalogs;
drop policy if exists "Public catalogs write" on public.catalogs;
drop policy if exists "Public customers all" on public.customers;
drop policy if exists "Public orders all" on public.orders;
drop policy if exists "Public storage read" on storage.objects;
drop policy if exists "Public storage write" on storage.objects;

-- Policies for tables
create policy "Public store settings read" on public.store_settings for select using (true);
create policy "Public store settings write" on public.store_settings for all using (true) with check (true);

create policy "Public catalogs read" on public.catalogs for select using (true);
create policy "Public catalogs write" on public.catalogs for all using (true) with check (true);

create policy "Public customers all" on public.customers for all using (true) with check (true);
create policy "Public orders all" on public.orders for all using (true) with check (true);

-- Policies for public product image uploads
create policy "Public storage read" on storage.objects for select using (bucket_id = 'product-images');
create policy "Public storage write" on storage.objects for insert with check (bucket_id = 'product-images');
create policy "Public storage update" on storage.objects for update using (bucket_id = 'product-images');
create policy "Public storage delete" on storage.objects for delete using (bucket_id = 'product-images');
