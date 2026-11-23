CREATE TABLE public.performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  kind text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  photo_path text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false
);
CREATE TABLE public.gatherings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  theme text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  region text NOT NULL,
  event_date date NOT NULL,
  start_time text NOT NULL DEFAULT '',
  end_time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  map_url text NOT NULL DEFAULT '',
  min_people integer NOT NULL DEFAULT 0,
  capacity integer NOT NULL DEFAULT 0,
  fee integer NOT NULL DEFAULT 0,
  payment_note text NOT NULL DEFAULT '',
  payment_url text NOT NULL DEFAULT '',
  perks text NOT NULL DEFAULT '',
  performer_ids uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'open',
  status_note text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true
);
CREATE TABLE public.gathering_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  gathering_id uuid NOT NULL REFERENCES public.gatherings(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  messenger text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  paid boolean NOT NULL DEFAULT false,
  attended boolean NOT NULL DEFAULT false
);
CREATE TABLE public.gathering_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  theme text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  is_open boolean NOT NULL DEFAULT true
);
CREATE TABLE public.gathering_poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.gathering_polls(id) ON DELETE CASCADE,
  option_date date NOT NULL,
  start_time text NOT NULL DEFAULT '',
  end_time text NOT NULL DEFAULT ''
);
CREATE TABLE public.gathering_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  option_id uuid NOT NULL REFERENCES public.gathering_poll_options(id) ON DELETE CASCADE,
  voter_key text NOT NULL,
  UNIQUE (option_id, voter_key)
);
CREATE TABLE public.gathering_wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  theme text NOT NULL,
  content text NOT NULL,
  nickname text NOT NULL DEFAULT '',
  contact text NOT NULL DEFAULT ''
);
GRANT ALL ON public.performers, public.gatherings, public.gathering_registrations, public.gathering_polls, public.gathering_poll_options, public.gathering_votes, public.gathering_wishes TO service_role;
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gatherings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gathering_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gathering_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gathering_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gathering_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gathering_wishes ENABLE ROW LEVEL SECURITY;