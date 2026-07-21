
DROP POLICY IF EXISTS posts_view_all ON public.community_posts;
CREATE POLICY posts_view_approved ON public.community_posts
  FOR SELECT TO authenticated
  USING (public.is_current_user_approved());

DROP POLICY IF EXISTS comments_view_all ON public.community_comments;
CREATE POLICY comments_view_approved ON public.community_comments
  FOR SELECT TO authenticated
  USING (public.is_current_user_approved());

DROP POLICY IF EXISTS "Anyone can view questions" ON public.community_questions;
CREATE POLICY questions_view_approved ON public.community_questions
  FOR SELECT TO authenticated
  USING (public.is_current_user_approved());

DROP POLICY IF EXISTS "add own reaction" ON public.message_reactions;
CREATE POLICY "add own reaction" ON public.message_reactions
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.chat_messages m
      JOIN public.channels c ON c.id = m.channel_id
      WHERE m.id = message_reactions.message_id
        AND public.can_view_channel(auth.uid(), c.category)
    )
  );

CREATE OR REPLACE FUNCTION public.prevent_question_upvote_tamper()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.upvotes IS DISTINCT FROM OLD.upvotes
     AND NOT public.is_current_user_admin() THEN
    NEW.upvotes := OLD.upvotes;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_question_upvote_tamper ON public.community_questions;
CREATE TRIGGER trg_prevent_question_upvote_tamper
  BEFORE UPDATE ON public.community_questions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_question_upvote_tamper();

CREATE OR REPLACE FUNCTION public.increment_question_upvote(_question_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF NOT public.is_current_user_approved() THEN
    RAISE EXCEPTION 'Approval required';
  END IF;
  UPDATE public.community_questions
     SET upvotes = COALESCE(upvotes, 0) + 1
   WHERE id = _question_id
   RETURNING upvotes INTO new_count;
  RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_question_upvote(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.increment_question_upvote(uuid) TO authenticated;

DROP POLICY IF EXISTS notes_uploads_user_update_own ON storage.objects;
CREATE POLICY notes_uploads_user_update_own ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'notes-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'notes-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.is_current_user_approved()
  );
