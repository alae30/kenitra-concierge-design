alter table public.rental_bookings
  add column guest_first_name text check (char_length(guest_first_name) between 1 and 100),
  add column guest_last_name text check (char_length(guest_last_name) between 1 and 100),
  add column guest_phone text check (char_length(guest_phone) between 7 and 30);
