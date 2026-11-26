create table public.concierge_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  phone text check (char_length(phone) between 1 and 30 and phone ~ '^[+0-9 ().-]+$' and phone ~ '[0-9]'),
  location text not null check (char_length(btrim(location)) between 1 and 120),
  property_type text not null check (property_type in ('Studio', 'Appartement', 'Maison ou villa', 'Autre')),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.concierge_inquiries enable row level security;
revoke all on public.concierge_inquiries from public, anon, authenticated;
grant insert (full_name, email, phone, location, property_type, message)
  on public.concierge_inquiries to anon, authenticated;
grant select, update (status) on public.concierge_inquiries to authenticated;

create policy "visitors submit new concierge inquiries"
  on public.concierge_inquiries for insert to anon, authenticated
  with check (status = 'new');

create policy "admins read concierge inquiries"
  on public.concierge_inquiries for select to authenticated
  using ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));

create policy "admins change concierge inquiry status"
  on public.concierge_inquiries for update to authenticated
  using ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))))
  with check ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));

create index concierge_inquiries_created_at_idx on public.concierge_inquiries (created_at desc, id desc);
