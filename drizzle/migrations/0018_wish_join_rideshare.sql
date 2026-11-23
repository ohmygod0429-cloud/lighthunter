ALTER TABLE public.gathering_wish_joins
  ADD COLUMN ride_role text NOT NULL DEFAULT 'none',
  ADD COLUMN seats integer NOT NULL DEFAULT 0,
  ADD COLUMN ride_meet_location text NOT NULL DEFAULT '',
  ADD COLUMN ride_meet_time text NOT NULL DEFAULT '',
  ADD COLUMN ride_conditions text NOT NULL DEFAULT '',
  ADD COLUMN ride_driver_id uuid REFERENCES public.gathering_wish_joins(id) ON DELETE SET NULL,
  ADD COLUMN agree_ride_safety boolean NOT NULL DEFAULT false,
  ADD COLUMN license_plate text NOT NULL DEFAULT '';
CREATE OR REPLACE FUNCTION public.enforce_wish_ride_seats()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE d record; taken int;
BEGIN
  IF NEW.ride_driver_id IS NULL THEN RETURN NEW; END IF;
  SELECT * INTO d FROM public.gathering_wish_joins WHERE id = NEW.ride_driver_id FOR UPDATE;
  IF d IS NULL OR d.ride_role <> 'driver' OR d.wish_id <> NEW.wish_id THEN
    RAISE EXCEPTION 'invalid driver' USING ERRCODE = 'P0001';
  END IF;
  SELECT count(*) INTO taken FROM public.gathering_wish_joins WHERE ride_driver_id = NEW.ride_driver_id AND id <> NEW.id;
  IF taken >= d.seats THEN RAISE EXCEPTION 'seats full' USING ERRCODE = 'P0002'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER wish_ride_seats BEFORE INSERT OR UPDATE OF ride_driver_id ON public.gathering_wish_joins
  FOR EACH ROW EXECUTE FUNCTION public.enforce_wish_ride_seats();