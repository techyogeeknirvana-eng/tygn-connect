REVOKE ALL ON FUNCTION public.ensure_own_profile(text, text, text, text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ensure_own_profile(text, text, text, text, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.ensure_own_profile(text, text, text, text, integer) TO authenticated;