-- Apply with the migration tool only after permission for the live-site transition.
-- The deployed site must use prepared photo uploads and server-issued published-file links.
DROP POLICY IF EXISTS "Anon can upload application photos" ON storage.objects;
DROP POLICY IF EXISTS "Visitors read published section files" ON storage.objects;