ALTER TABLE public.gathering_wishes
  ADD COLUMN meet_location text NOT NULL DEFAULT '',
  ADD COLUMN conditions text NOT NULL DEFAULT '',
  ADD COLUMN status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.gatherings
  ADD COLUMN rideshare_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN meet_point text NOT NULL DEFAULT '';
ALTER TABLE public.gathering_registrations
  ADD COLUMN ride_role text NOT NULL DEFAULT 'none',
  ADD COLUMN seats integer NOT NULL DEFAULT 0,
  ADD COLUMN ride_meet_location text NOT NULL DEFAULT '',
  ADD COLUMN ride_meet_time text NOT NULL DEFAULT '',
  ADD COLUMN ride_conditions text NOT NULL DEFAULT '',
  ADD COLUMN ride_driver_id uuid REFERENCES public.gathering_registrations(id) ON DELETE SET NULL,
  ADD COLUMN agree_ride_safety boolean NOT NULL DEFAULT false,
  ADD COLUMN driver_code text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.enforce_ride_seats()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE d record; taken int;
BEGIN
  IF NEW.ride_driver_id IS NULL THEN RETURN NEW; END IF;
  SELECT * INTO d FROM public.gathering_registrations WHERE id = NEW.ride_driver_id FOR UPDATE;
  IF d IS NULL OR d.ride_role <> 'driver' OR d.gathering_id <> NEW.gathering_id THEN
    RAISE EXCEPTION 'invalid driver' USING ERRCODE = 'P0001';
  END IF;
  SELECT count(*) INTO taken FROM public.gathering_registrations WHERE ride_driver_id = NEW.ride_driver_id AND id <> NEW.id;
  IF taken >= d.seats THEN RAISE EXCEPTION 'seats full' USING ERRCODE = 'P0002'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER gathering_registrations_ride_seats BEFORE INSERT OR UPDATE OF ride_driver_id ON public.gathering_registrations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_ride_seats();