
CREATE POLICY "notes_uploads_user_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'notes-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.is_current_user_approved()
);

CREATE POLICY "notes_uploads_user_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'notes-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "notes_uploads_user_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'notes-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "notes_uploads_mod_all"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'notes-uploads' AND public.is_current_user_moderator())
WITH CHECK (bucket_id = 'notes-uploads' AND public.is_current_user_moderator());
