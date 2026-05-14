-- Notifications from admin
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  important boolean NOT NULL DEFAULT false,
  target_user_id uuid NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_target_idx ON public.notifications(target_user_id);
CREATE INDEX IF NOT EXISTS notifications_created_idx ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_view_targeted_or_broadcast"
  ON public.notifications FOR SELECT TO authenticated
  USING (target_user_id IS NULL OR target_user_id = auth.uid() OR public.is_current_user_admin());

CREATE POLICY "notifications_insert_admin"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_current_user_admin() AND created_by = auth.uid());

CREATE POLICY "notifications_delete_admin"
  ON public.notifications FOR DELETE TO authenticated
  USING (public.is_current_user_admin());

CREATE POLICY "notifications_update_admin"
  ON public.notifications FOR UPDATE TO authenticated
  USING (public.is_current_user_admin());

-- Per-user read tracking
CREATE TABLE IF NOT EXISTS public.notification_reads (
  notification_id uuid NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (notification_id, user_id)
);
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reads_view_own"
  ON public.notification_reads FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "reads_insert_own"
  ON public.notification_reads FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reads_delete_own"
  ON public.notification_reads FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Allow owners to delete their own posts
CREATE POLICY "events_delete_own"
  ON public.events FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "jobs_delete_own"
  ON public.jobs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "internships_delete_own"
  ON public.internships FOR DELETE TO authenticated
  USING (auth.uid() = user_id);