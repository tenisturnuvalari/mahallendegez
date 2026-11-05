-- ============================================================
-- Mahallende Gez — Supabase şeması
-- Supabase dashboard > SQL Editor > New query ile çalıştır
-- ============================================================

-- Anılar tablosu
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  district text not null default 'Diğer',
  neighborhood text,
  year text,
  story text,
  image_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists memories_created_at_idx on public.memories (created_at desc);
create index if not exists memories_district_idx on public.memories (district);

-- Row Level Security
alter table public.memories enable row level security;

drop policy if exists "Herkes anıları görebilir" on public.memories;
create policy "Herkes anıları görebilir"
  on public.memories for select
  using (true);

drop policy if exists "Kendi anısını ekleyebilir" on public.memories;
create policy "Kendi anısını ekleyebilir"
  on public.memories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Kendi anısını silebilir" on public.memories;
create policy "Kendi anısını silebilir"
  on public.memories for delete
  using (auth.uid() = user_id);

-- Fotoğraf depolama kovası (herkese açık okuma)
insert into storage.buckets (id, name, public)
values ('memories', 'memories', true)
on conflict (id) do nothing;

drop policy if exists "Fotoğraf yükleme (girişli)" on storage.objects;
create policy "Fotoğraf yükleme (girişli)"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Fotoğraflar herkese açık" on storage.objects;
create policy "Fotoğraflar herkese açık"
  on storage.objects for select
  using (bucket_id = 'memories');

drop policy if exists "Kendi fotoğrafını silebilir" on storage.objects;
create policy "Kendi fotoğrafını silebilir"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'memories'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
