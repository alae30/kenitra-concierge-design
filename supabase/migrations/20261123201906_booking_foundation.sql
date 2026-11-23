create extension if not exists btree_gist with schema extensions;

create table public.rental_properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  description text not null default '',
  photos text[] not null default '{}',
  nightly_price_mad numeric(10,2) not null check (nightly_price_mad > 0),
  max_guests integer not null check (max_guests > 0),
  published boolean not null default false
);

create table public.rental_bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.rental_properties(id),
  arrival date not null,
  departure date not null check (departure > arrival),
  guests integer not null check (guests > 0),
  guest_name text not null,
  guest_email text not null,
  total_mad numeric(12,2) not null check (total_mad > 0),
  terms_version text not null,
  terms_text text not null,
  signed_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  exclude using gist (property_id with =, daterange(arrival, departure, '[)') with &&)
    where (status = 'confirmed')
);
create index rental_bookings_property_id_idx on public.rental_bookings(property_id);

alter table public.rental_properties enable row level security;
alter table public.rental_bookings enable row level security;

revoke all on public.rental_properties, public.rental_bookings from public, anon, authenticated;
grant select on public.rental_properties to anon, authenticated;
grant select, insert, update, delete on public.rental_properties, public.rental_bookings to service_role;

create policy "published rentals are visible"
  on public.rental_properties for select to anon, authenticated using (published);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('rental-identity', 'rental-identity', false, 5242880, array['image/jpeg', 'image/png']),
  ('rental-agreements', 'rental-agreements', false, 5242880, array['application/pdf']);
