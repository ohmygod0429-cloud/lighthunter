CREATE TABLE public.section_external_links (
  slot_id text PRIMARY KEY,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT section_links_array CHECK (jsonb_typeof(links) = 'array' AND jsonb_array_length(links) <= 10)
);
GRANT SELECT ON public.section_external_links TO anon, authenticated;
GRANT ALL ON public.section_external_links TO service_role;
ALTER TABLE public.section_external_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published section links are public" ON public.section_external_links FOR SELECT TO anon, authenticated USING (true);