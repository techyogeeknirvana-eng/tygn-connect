
-- 1. Restrict chat_messages INSERT to approved users
DROP POLICY IF EXISTS "post in viewable channels" ON public.chat_messages;
CREATE POLICY "post in viewable channels" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.is_current_user_approved()
    AND EXISTS (
      SELECT 1 FROM public.channels c
      WHERE c.id = channel_id
        AND public.can_view_channel(auth.uid(), c.category)
    )
  );

-- 2. Restrict notes SELECT to authenticated approved users (PII in content)
DROP POLICY IF EXISTS "Anyone can view notes" ON public.notes;
CREATE POLICY "Approved users can view notes" ON public.notes
  FOR SELECT TO authenticated
  USING (public.is_current_user_approved());

-- 3. Scope notes-uploads moderator SELECT to approved contributions only
DROP POLICY IF EXISTS notes_uploads_mod_all ON storage.objects;
CREATE POLICY notes_uploads_mod_all_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'notes-uploads'
    AND public.is_current_user_moderator()
    AND EXISTS (
      SELECT 1 FROM public.notes_contributions nc
      WHERE nc.status = 'approved'
        AND nc.file_url LIKE '%' || name
    )
  );
