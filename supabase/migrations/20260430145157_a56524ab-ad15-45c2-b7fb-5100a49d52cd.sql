ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS branch text,
ADD COLUMN IF NOT EXISTS semester integer;

CREATE OR REPLACE FUNCTION public.ensure_own_profile(
  _full_name text DEFAULT NULL,
  _avatar_url text DEFAULT NULL,
  _phone_number text DEFAULT NULL,
  _branch text DEFAULT NULL,
  _semester integer DEFAULT NULL
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  existing_profile public.profiles;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    phone_number,
    branch,
    semester,
    approval_status,
    approved_at
  )
  VALUES (
    current_user_id,
    COALESCE(NULLIF(_full_name, ''), ''),
    NULLIF(_avatar_url, ''),
    NULLIF(_phone_number, ''),
    NULLIF(_branch, ''),
    _semester,
    CASE
      WHEN auth.jwt() ->> 'email' = 'techyogeeknirvana@gmail.com' THEN 'approved'
      ELSE 'pending'
    END,
    CASE
      WHEN auth.jwt() ->> 'email' = 'techyogeeknirvana@gmail.com' THEN now()
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number),
    branch = COALESCE(EXCLUDED.branch, profiles.branch),
    semester = COALESCE(EXCLUDED.semester, profiles.semester),
    approval_status = CASE
      WHEN auth.jwt() ->> 'email' = 'techyogeeknirvana@gmail.com' THEN 'approved'
      ELSE profiles.approval_status
    END,
    approved_at = CASE
      WHEN auth.jwt() ->> 'email' = 'techyogeeknirvana@gmail.com' THEN COALESCE(profiles.approved_at, now())
      ELSE profiles.approved_at
    END
  RETURNING * INTO existing_profile;

  RETURN existing_profile;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_own_profile(text, text, text, text, integer) TO authenticated;