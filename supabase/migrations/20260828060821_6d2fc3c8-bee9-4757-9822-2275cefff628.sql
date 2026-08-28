ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS interests text;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS reasons text;