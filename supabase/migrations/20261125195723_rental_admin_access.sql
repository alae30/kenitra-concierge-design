create table public.rental_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.rental_admins enable row level security;
revoke all on public.rental_admins from public, anon, authenticated;
grant select on public.rental_admins to authenticated;
create policy "admin membership is visible to its owner"
  on public.rental_admins for select to authenticated
  using (user_id = (select auth.uid()));

alter table public.rental_properties
  add column weekend_price_mad numeric(10,2) check (weekend_price_mad > 0),
  add column featured boolean not null default false,
  add column updated_at timestamptz not null default now();
create unique index rental_properties_one_featured_idx on public.rental_properties (featured) where featured;
alter table public.rental_bookings add column contract_path text;
create index rental_bookings_created_at_idx on public.rental_bookings (created_at desc);

grant insert, update on public.rental_properties to authenticated;
grant select on public.rental_bookings to authenticated;
grant update (status) on public.rental_bookings to authenticated;

create policy "admins read properties" on public.rental_properties for select to authenticated
  using ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));
create policy "admins add properties" on public.rental_properties for insert to authenticated
  with check ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));
create policy "admins edit properties" on public.rental_properties for update to authenticated
  using ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))))
  with check ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));

create policy "admins read bookings" on public.rental_bookings for select to authenticated
  using ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));
create policy "admins change booking status" on public.rental_bookings for update to authenticated
  using ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))))
  with check ((select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('rental-photos', 'rental-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "admins upload property photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'rental-photos' and (select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));
create policy "admins read property photo objects" on storage.objects for select to authenticated
  using (bucket_id = 'rental-photos' and (select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));
create policy "admins delete property photos" on storage.objects for delete to authenticated
  using (bucket_id = 'rental-photos' and (select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));
create policy "admins download signed contracts" on storage.objects for select to authenticated
  using (bucket_id = 'rental-agreements' and (select exists (select 1 from public.rental_admins where user_id = (select auth.uid()))));

insert into public.rental_properties (title, location, description, nightly_price_mad, weekend_price_mad, max_guests, featured)
values ('Center Warm Stay', 'Kénitra', 'Studio avec cuisine ouverte, coin salon, lit double et salle d’eau avec douche.', 500, 700, 2, true);
