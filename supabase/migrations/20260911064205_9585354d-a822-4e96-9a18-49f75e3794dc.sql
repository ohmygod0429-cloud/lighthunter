ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS licenses text;

COMMENT ON COLUMN public.membership_applications.licenses IS '申請人持有的各類證照，無則填「無」';