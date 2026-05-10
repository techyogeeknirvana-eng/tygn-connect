
-- 1. Quizzes: only admins can SELECT full quizzes (with answer keys)
DROP POLICY IF EXISTS "Admins or creators can view full quizzes" ON public.quizzes;
CREATE POLICY "Admins can view full quizzes"
ON public.quizzes
FOR SELECT
USING (is_current_user_admin());

-- 2. Attach the existing privilege-escalation guard trigger to profiles
DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 3. Helper function for approval check
CREATE OR REPLACE FUNCTION public.is_current_user_approved()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND approval_status = 'approved'
  ) OR public.is_current_user_admin()
$$;

-- 4. Require approval to insert content
DROP POLICY IF EXISTS "posts_insert_own" ON public.community_posts;
CREATE POLICY "posts_insert_own"
ON public.community_posts FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_current_user_approved());

DROP POLICY IF EXISTS "comments_insert_own" ON public.community_comments;
CREATE POLICY "comments_insert_own"
ON public.community_comments FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_current_user_approved());

DROP POLICY IF EXISTS "Authenticated users can create questions" ON public.community_questions;
CREATE POLICY "Authenticated users can create questions"
ON public.community_questions FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_current_user_approved());

DROP POLICY IF EXISTS "events_insert_own" ON public.events;
CREATE POLICY "events_insert_own"
ON public.events FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_current_user_approved());

DROP POLICY IF EXISTS "jobs_insert_own" ON public.jobs;
CREATE POLICY "jobs_insert_own"
ON public.jobs FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_current_user_approved());

DROP POLICY IF EXISTS "internships_insert_own" ON public.internships;
CREATE POLICY "internships_insert_own"
ON public.internships FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_current_user_approved());

DROP POLICY IF EXISTS "notes_contrib_insert_own" ON public.notes_contributions;
CREATE POLICY "notes_contrib_insert_own"
ON public.notes_contributions FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_current_user_approved());
