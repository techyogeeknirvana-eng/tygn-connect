-- Add phone number and approval status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);

-- Create index for faster approval status queries
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON public.profiles(approval_status);

-- Function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT approval_status = 'approved' FROM public.profiles WHERE id = uid),
    false
  );
$$;

-- Update RLS policies to allow admins to manage user approvals
CREATE POLICY "Admins can update any profile approval" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (is_admin_email(auth.uid()) OR is_admin(auth.uid()))
WITH CHECK (is_admin_email(auth.uid()) OR is_admin(auth.uid()));

-- Allow users to see their own approval status
CREATE POLICY "Users can view own approval status" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id OR is_admin_email(auth.uid()) OR is_admin(auth.uid()));