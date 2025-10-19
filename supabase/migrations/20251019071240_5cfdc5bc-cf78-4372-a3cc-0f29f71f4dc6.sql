-- Function to auto-approve admin email on profile creation/update
CREATE OR REPLACE FUNCTION public.auto_approve_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the admin email
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.id 
    AND email = 'techyogeeknirvana@gmail.com'
  ) THEN
    -- Automatically approve the admin
    NEW.approval_status = 'approved';
    NEW.approved_at = NOW();
    NEW.approved_by = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-approve admin on insert or update
DROP TRIGGER IF EXISTS auto_approve_admin_trigger ON public.profiles;
CREATE TRIGGER auto_approve_admin_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_approve_admin();

-- Update existing admin profile if it exists
UPDATE public.profiles
SET 
  approval_status = 'approved',
  approved_at = NOW(),
  approved_by = profiles.id
FROM auth.users
WHERE profiles.id = auth.users.id
  AND auth.users.email = 'techyogeeknirvana@gmail.com'
  AND profiles.approval_status != 'approved';

-- Insert admin profile if it doesn't exist
INSERT INTO public.profiles (id, full_name, approval_status, approved_at, approved_by)
SELECT 
  auth.users.id, 
  COALESCE(auth.users.raw_user_meta_data->>'full_name', 'Admin'),
  'approved',
  NOW(),
  auth.users.id
FROM auth.users
WHERE auth.users.email = 'techyogeeknirvana@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  approval_status = 'approved',
  approved_at = NOW(),
  approved_by = EXCLUDED.id;