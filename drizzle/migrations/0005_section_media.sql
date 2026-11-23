CREATE TABLE public.section_media (
 slot_id text PRIMARY KEY,
 video_title text NOT NULL DEFAULT '',
 video_url text NOT NULL DEFAULT '',
 video_path text NOT NULL DEFAULT '',
 file_title text NOT NULL DEFAULT '',
 file_path text NOT NULL DEFAULT '',
 file_name text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.section_media TO anon, authenticated;
GRANT ALL ON public.section_media TO service_role;
ALTER TABLE public.section_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public section media read" ON public.section_media FOR SELECT TO anon, authenticated USING (true);
