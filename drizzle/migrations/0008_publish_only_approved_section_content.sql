ALTER TABLE public.section_external_links ADD COLUMN is_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.section_media ADD COLUMN is_published boolean NOT NULL DEFAULT false;
UPDATE public.section_external_links SET is_published = true WHERE jsonb_array_length(links) > 0;
UPDATE public.section_media SET is_published = true WHERE video_url <> '' OR video_path <> '' OR file_path <> '';
ALTER POLICY "Published section links are public" ON public.section_external_links USING (is_published AND jsonb_array_length(links) > 0);
ALTER POLICY "Public section media read" ON public.section_media USING (is_published AND (video_url <> '' OR video_path <> '' OR file_path <> ''));
COMMENT ON COLUMN public.section_external_links.is_published IS 'Set by secret-validated section saves; only published nonempty settings are public.';
COMMENT ON COLUMN public.section_media.is_published IS 'Set by secret-validated section saves; only published nonempty settings are public.';