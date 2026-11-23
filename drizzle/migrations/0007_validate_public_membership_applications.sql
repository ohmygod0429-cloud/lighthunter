ALTER POLICY "Anyone can submit an application" ON public.membership_applications
WITH CHECK (
  char_length(btrim(full_name)) > 0
  AND full_name !~ '[0-9]'
  AND char_length(btrim(title_company)) > 0
  AND business_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND COALESCE(phone ~ '^[0-9]{10}$', false)
  AND COALESCE(birth_date ~ '^[0-9]{4}/[0-9]{2}/[0-9]{2}$', false)
  AND COALESCE(char_length(btrim(messenger)) > 0, false)
  AND char_length(btrim(revenue_band)) > 0
  AND char_length(btrim(liquid_assets)) > 0
  AND char_length(btrim(industry)) > 0
  AND COALESCE(char_length(btrim(pillars)) > 0, false)
  AND char_length(btrim(core_value)) > 0
  AND COALESCE(char_length(btrim(licenses)) > 0, false)
  AND COALESCE(life_photo_path ~ '^life/[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$', false)
  AND COALESCE(headshot_path ~ '^headshot/[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$', false)
  AND agree_etiquette = true
  AND agree_truthful = true
  AND agree_house_rules = true
  AND COALESCE(char_length(btrim(meeting_time_pref)) > 0, false)
);