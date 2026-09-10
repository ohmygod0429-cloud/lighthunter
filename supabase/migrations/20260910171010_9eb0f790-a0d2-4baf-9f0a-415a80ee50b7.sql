alter table public.membership_applications add column if not exists phone text;
alter table public.membership_applications add column if not exists messenger text;
alter table public.membership_applications add column if not exists life_photo_path text;
alter table public.membership_applications add column if not exists headshot_path text;
alter table public.membership_applications alter column contact drop not null;

create policy "Anon can upload application photos"
on storage.objects for insert
to anon
with check (bucket_id = 'application-photos');

create policy "Service role can read all application photos"
on storage.objects for select
to service_role
using (bucket_id = 'application-photos');