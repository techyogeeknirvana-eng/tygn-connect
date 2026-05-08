
-- 1) Quizzes: restrict insert/update to admin only
DROP POLICY IF EXISTS "Authenticated users can create quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Users can update their own quizzes" ON public.quizzes;

CREATE POLICY "Admins can create quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update quizzes"
  ON public.quizzes FOR UPDATE
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete quizzes"
  ON public.quizzes FOR DELETE
  USING (public.is_current_user_admin());

-- 2) Quizzes: safe view that strips answerIndex from questions JSONB
DROP VIEW IF EXISTS public.quizzes_public;
CREATE VIEW public.quizzes_public
WITH (security_invoker = true)
AS
SELECT
  id,
  title,
  topic,
  description,
  start_at,
  end_at,
  status,
  created_at,
  created_by,
  (
    SELECT COALESCE(jsonb_agg(q - 'answerIndex' - 'answer' - 'correctIndex' - 'correct'), '[]'::jsonb)
    FROM jsonb_array_elements(COALESCE(questions, '[]'::jsonb)) q
  ) AS questions
FROM public.quizzes
WHERE status = 'published';

GRANT SELECT ON public.quizzes_public TO anon, authenticated;

-- Tighten base table SELECT so answers are only readable by admin or creator
DROP POLICY IF EXISTS "Anyone can view published quizzes" ON public.quizzes;
CREATE POLICY "Admins or creators can view full quizzes"
  ON public.quizzes FOR SELECT
  USING (public.is_current_user_admin() OR auth.uid() = created_by);

-- 3) Profiles: prevent self-approval. Add WITH CHECK + trigger to lock sensitive fields
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_current_user_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at THEN
    RAISE EXCEPTION 'Not allowed to modify approval fields';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_privilege_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 4) Notes: remove direct insert; only the moderated contribution approval path inserts
DROP POLICY IF EXISTS "Authenticated users can create notes" ON public.notes;

CREATE POLICY "Admins can insert notes"
  ON public.notes FOR INSERT
  WITH CHECK (public.is_current_user_admin());
