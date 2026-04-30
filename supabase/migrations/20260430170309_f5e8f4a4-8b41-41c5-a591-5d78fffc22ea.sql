-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  event_date timestamptz,
  location text,
  link text,
  image_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  job_type text,
  salary_range text,
  description text,
  link text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Internships
CREATE TABLE IF NOT EXISTS public.internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  duration text,
  stipend text,
  description text,
  link text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- Notes contributions (pending approval; approved ones move to public.notes via trigger)
CREATE TABLE IF NOT EXISTS public.notes_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  contributor_name text NOT NULL,
  subject text NOT NULL,
  content text,
  file_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notes_contributions ENABLE ROW LEVEL SECURITY;

-- Community posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  board text DEFAULT 'general',
  upvotes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Community comments
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Helper: is_current_user_admin via JWT email
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT (auth.jwt() ->> 'email') = 'techyogeeknirvana@gmail.com' $$;

-- Generic RLS pattern: anyone (incl anon) can view approved; owner sees own; admin sees all & manages all
-- EVENTS
CREATE POLICY "events_view_approved" ON public.events FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "events_insert_own" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "events_update_own_or_admin" ON public.events FOR UPDATE USING (auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "events_delete_admin" ON public.events FOR DELETE USING (public.is_current_user_admin());

-- JOBS
CREATE POLICY "jobs_view_approved" ON public.jobs FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "jobs_insert_own" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "jobs_update_own_or_admin" ON public.jobs FOR UPDATE USING (auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "jobs_delete_admin" ON public.jobs FOR DELETE USING (public.is_current_user_admin());

-- INTERNSHIPS
CREATE POLICY "internships_view_approved" ON public.internships FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "internships_insert_own" ON public.internships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "internships_update_own_or_admin" ON public.internships FOR UPDATE USING (auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "internships_delete_admin" ON public.internships FOR DELETE USING (public.is_current_user_admin());

-- NOTES CONTRIBUTIONS
CREATE POLICY "notes_contrib_view_own_or_admin" ON public.notes_contributions FOR SELECT USING (auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "notes_contrib_insert_own" ON public.notes_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_contrib_update_admin" ON public.notes_contributions FOR UPDATE USING (public.is_current_user_admin());
CREATE POLICY "notes_contrib_delete_admin" ON public.notes_contributions FOR DELETE USING (public.is_current_user_admin());

-- Allow admin full read on profiles + update approval
CREATE POLICY "profiles_admin_view_all" ON public.profiles FOR SELECT USING (public.is_current_user_admin());
CREATE POLICY "profiles_admin_update_all" ON public.profiles FOR UPDATE USING (public.is_current_user_admin());

-- COMMUNITY POSTS - anyone authenticated can read & post; owner can update/delete; admin can moderate
CREATE POLICY "posts_view_all" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update_own_or_admin" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "posts_delete_own_or_admin" ON public.community_posts FOR DELETE USING (auth.uid() = user_id OR public.is_current_user_admin());

-- COMMUNITY COMMENTS
CREATE POLICY "comments_view_all" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own_or_admin" ON public.community_comments FOR UPDATE USING (auth.uid() = user_id OR public.is_current_user_admin());
CREATE POLICY "comments_delete_own_or_admin" ON public.community_comments FOR DELETE USING (auth.uid() = user_id OR public.is_current_user_admin());

-- Trigger: when notes_contributions becomes 'approved' insert into public.notes
CREATE OR REPLACE FUNCTION public.on_notes_contribution_approved()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.notes (subject, content, file_url, contributor_name)
    VALUES (NEW.subject, NEW.content, NEW.file_url, NEW.contributor_name);
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notes_contrib_approved ON public.notes_contributions;
CREATE TRIGGER trg_notes_contrib_approved
AFTER UPDATE ON public.notes_contributions
FOR EACH ROW EXECUTE FUNCTION public.on_notes_contribution_approved();

-- updated_at trigger function (reuse generic)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_internships_updated BEFORE UPDATE ON public.internships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_notes_contrib_updated BEFORE UPDATE ON public.notes_contributions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Realtime
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.community_comments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;