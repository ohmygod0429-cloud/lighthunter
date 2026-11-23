ALTER TABLE public.gatherings ADD COLUMN location_photo_path text NOT NULL DEFAULT '', ADD COLUMN payment_qr_path text NOT NULL DEFAULT '';
ALTER TABLE public.gathering_wishes ADD COLUMN min_people integer NOT NULL DEFAULT 0;
CREATE TABLE public.gathering_wish_joins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  wish_id uuid NOT NULL REFERENCES public.gathering_wishes(id) ON DELETE CASCADE,
  voter_key text NOT NULL,
  name text NOT NULL DEFAULT '',
  contact text NOT NULL DEFAULT '',
  UNIQUE (wish_id, voter_key)
);
GRANT ALL ON public.gathering_wish_joins TO service_role;
ALTER TABLE public.gathering_wish_joins ENABLE ROW LEVEL SECURITY;