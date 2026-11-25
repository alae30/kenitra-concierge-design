import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const allowedOrigin = import.meta.env.VITE_BOOKING_SITE_ORIGIN;

export const supabase = url && key && allowedOrigin === window.location.origin
  ? createClient(url, key)
  : null;

export type RentalProperty = {
  id: string;
  title: string;
  location: string;
  description: string;
  photos: string[];
  nightly_price_mad: number;
  weekend_price_mad: number | null;
  max_guests: number;
  published: boolean;
  featured: boolean;
  updated_at: string;
};

export function rentalPhotoUrl(path: string) {
  return supabase?.storage.from("rental-photos").getPublicUrl(path).data.publicUrl ?? "";
}

export async function getPublishedProperties() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("rental_properties").select("*").eq("published", true).order("title");
  if (error) throw error;
  return data as RentalProperty[];
}
