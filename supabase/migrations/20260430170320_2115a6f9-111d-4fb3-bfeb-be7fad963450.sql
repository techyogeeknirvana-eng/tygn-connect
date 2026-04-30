ALTER FUNCTION public.set_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.on_notes_contribution_approved() FROM PUBLIC, anon, authenticated;