-- Community posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  images text[],
  documents text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Community reactions table
CREATE TABLE IF NOT EXISTS public.community_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT reaction_target CHECK ((post_id IS NOT NULL) OR (comment_id IS NOT NULL))
);

-- Events table with approval
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  location text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Jobs table with approval
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  description text,
  location text,
  job_type text,
  salary_range text,
  application_link text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Notes contributions table
CREATE TABLE IF NOT EXISTS public.notes_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_name text NOT NULL,
  college text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL,
  subject_name text NOT NULL,
  file_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes_contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community posts
CREATE POLICY "public read approved posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "users create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for community comments
CREATE POLICY "public read comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "users create comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own comments" ON public.community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users delete own comments" ON public.community_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reactions
CREATE POLICY "public read reactions" ON public.community_reactions FOR SELECT USING (true);
CREATE POLICY "users manage own reactions" ON public.community_reactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "public read approved events" ON public.events FOR SELECT USING (status = 'approved');
CREATE POLICY "users create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "admin approve events" ON public.events FOR ALL USING (is_admin_email(auth.uid()) OR is_admin(auth.uid())) WITH CHECK (is_admin_email(auth.uid()) OR is_admin(auth.uid()));

-- RLS Policies for jobs
CREATE POLICY "public read approved jobs" ON public.jobs FOR SELECT USING (status = 'approved');
CREATE POLICY "users create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "admin approve jobs" ON public.jobs FOR ALL USING (is_admin_email(auth.uid()) OR is_admin(auth.uid())) WITH CHECK (is_admin_email(auth.uid()) OR is_admin(auth.uid()));

-- RLS Policies for notes contributions
CREATE POLICY "admin read notes" ON public.notes_contributions FOR SELECT USING (is_admin_email(auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "users submit notes" ON public.notes_contributions FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "admin approve notes" ON public.notes_contributions FOR UPDATE USING (is_admin_email(auth.uid()) OR is_admin(auth.uid()));