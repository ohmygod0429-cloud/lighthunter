CREATE TABLE public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  regions text[] NOT NULL DEFAULT '{}',
  photo_path text NOT NULL DEFAULT '',
  gallery_paths text[] NOT NULL DEFAULT '{}',
  contact text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false
);
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  region text NOT NULL,
  course_date date NOT NULL,
  start_time text NOT NULL DEFAULT '',
  end_time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  map_url text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true
);
CREATE TABLE public.course_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  messenger text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  attended boolean NOT NULL DEFAULT false
);
CREATE TABLE public.teacher_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  nickname text NOT NULL,
  content text NOT NULL,
  is_published boolean NOT NULL DEFAULT false
);
GRANT SELECT ON public.teachers, public.courses, public.teacher_reviews TO anon, authenticated;
GRANT ALL ON public.teachers, public.courses, public.course_registrations, public.teacher_reviews TO service_role;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published teachers are public" ON public.teachers FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Published courses are public" ON public.courses FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Published reviews are public" ON public.teacher_reviews FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Public read teacher photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'teacher-photos');