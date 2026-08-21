CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  line_id TEXT,
  industry TEXT,
  intent TEXT NOT NULL,
  plan TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.reservations TO anon;
GRANT INSERT ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a reservation"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 1 AND 40
    AND char_length(email) BETWEEN 3 AND 255
    AND coalesce(char_length(line_id), 0) <= 50
    AND coalesce(char_length(industry), 0) <= 100
    AND char_length(intent) <= 200
    AND char_length(plan) <= 40
    AND coalesce(char_length(message), 0) <= 1000
  );