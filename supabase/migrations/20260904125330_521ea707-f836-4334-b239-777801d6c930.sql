CREATE TABLE public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  title_company text NOT NULL,
  contact text NOT NULL,
  business_email text NOT NULL,
  revenue_band text NOT NULL,
  liquid_assets text NOT NULL,
  industry text NOT NULL,
  pillars text,
  core_value text NOT NULL,
  prior_orgs text,
  referrer text,
  agree_no_selling boolean NOT NULL DEFAULT false,
  agree_chatham boolean NOT NULL DEFAULT false
);
GRANT INSERT ON public.membership_applications TO anon;
GRANT INSERT ON public.membership_applications TO authenticated;
GRANT ALL ON public.membership_applications TO service_role;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an application" ON public.membership_applications FOR INSERT TO anon, authenticated WITH CHECK (true);