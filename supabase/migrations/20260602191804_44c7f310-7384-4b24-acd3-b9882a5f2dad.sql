
-- Helper: is the current user a moderator (or admin)?
CREATE OR REPLACE FUNCTION public.is_current_user_moderator()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_current_user_admin()
      OR EXISTS (
           SELECT 1 FROM public.user_roles
           WHERE user_id = auth.uid() AND role = 'moderator'
         )
$$;

-- Allow admin to manage user_roles (promote/demote moderators)
DROP POLICY IF EXISTS "user_roles_admin_all" ON public.user_roles;
CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- Let admins see every profile-derived roster row too (already done) - skip
-- Update content tables: moderators can update/delete and approve as well
DROP POLICY IF EXISTS events_update_own_or_admin ON public.events;
CREATE POLICY events_update_mod_or_owner ON public.events FOR UPDATE
  USING ((auth.uid() = user_id) OR public.is_current_user_moderator());
DROP POLICY IF EXISTS events_delete_admin ON public.events;
CREATE POLICY events_delete_mod ON public.events FOR DELETE
  USING (public.is_current_user_moderator());

DROP POLICY IF EXISTS jobs_update_own_or_admin ON public.jobs;
CREATE POLICY jobs_update_mod_or_owner ON public.jobs FOR UPDATE
  USING ((auth.uid() = user_id) OR public.is_current_user_moderator());
DROP POLICY IF EXISTS jobs_delete_admin ON public.jobs;
CREATE POLICY jobs_delete_mod ON public.jobs FOR DELETE
  USING (public.is_current_user_moderator());

DROP POLICY IF EXISTS internships_update_own_or_admin ON public.internships;
CREATE POLICY internships_update_mod_or_owner ON public.internships FOR UPDATE
  USING ((auth.uid() = user_id) OR public.is_current_user_moderator());
DROP POLICY IF EXISTS internships_delete_admin ON public.internships;
CREATE POLICY internships_delete_mod ON public.internships FOR DELETE
  USING (public.is_current_user_moderator());

DROP POLICY IF EXISTS notes_contrib_update_admin ON public.notes_contributions;
CREATE POLICY notes_contrib_update_mod ON public.notes_contributions FOR UPDATE
  USING (public.is_current_user_moderator());
DROP POLICY IF EXISTS notes_contrib_delete_admin ON public.notes_contributions;
CREATE POLICY notes_contrib_delete_mod ON public.notes_contributions FOR DELETE
  USING (public.is_current_user_moderator());

-- Also let moderators view pending content (was already implicit via is_admin only).
DROP POLICY IF EXISTS events_view_approved ON public.events;
CREATE POLICY events_view_approved ON public.events FOR SELECT
  USING ((status = 'approved') OR (auth.uid() = user_id) OR public.is_current_user_moderator());
DROP POLICY IF EXISTS jobs_view_approved ON public.jobs;
CREATE POLICY jobs_view_approved ON public.jobs FOR SELECT
  USING ((status = 'approved') OR (auth.uid() = user_id) OR public.is_current_user_moderator());
DROP POLICY IF EXISTS internships_view_approved ON public.internships;
CREATE POLICY internships_view_approved ON public.internships FOR SELECT
  USING ((status = 'approved') OR (auth.uid() = user_id) OR public.is_current_user_moderator());
DROP POLICY IF EXISTS notes_contrib_view_own_or_admin ON public.notes_contributions;
CREATE POLICY notes_contrib_view_own_or_mod ON public.notes_contributions FOR SELECT
  USING ((auth.uid() = user_id) OR public.is_current_user_moderator());

-- Moderators can also view all profiles (to manage approvals)
DROP POLICY IF EXISTS profiles_admin_view_all ON public.profiles;
CREATE POLICY profiles_mod_view_all ON public.profiles FOR SELECT
  USING (public.is_current_user_moderator());
DROP POLICY IF EXISTS profiles_admin_update_all ON public.profiles;
CREATE POLICY profiles_mod_update_all ON public.profiles FOR UPDATE
  USING (public.is_current_user_moderator());
