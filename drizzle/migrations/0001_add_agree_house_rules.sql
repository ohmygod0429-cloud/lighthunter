ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS agree_house_rules boolean NOT NULL DEFAULT false;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.membership_applications TO authenticated;
GRANT ALL ON public.membership_applications TO service_role;