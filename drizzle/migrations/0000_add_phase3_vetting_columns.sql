ALTER TABLE public.membership_applications
  ADD COLUMN IF NOT EXISTS agree_etiquette boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS agree_truthful boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS meeting_time_pref text;