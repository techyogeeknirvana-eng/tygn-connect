
-- Chat messages: allow moderators to update (pin) and delete any message
DROP POLICY IF EXISTS "edit own messages" ON public.chat_messages;
CREATE POLICY "edit own or moderator" ON public.chat_messages
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()
         OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3
         OR public.is_current_user_moderator())
  WITH CHECK (user_id = auth.uid()
         OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3
         OR public.is_current_user_moderator());

DROP POLICY IF EXISTS "delete own or admin" ON public.chat_messages;
CREATE POLICY "delete own or moderator" ON public.chat_messages
  FOR DELETE TO authenticated
  USING (user_id = auth.uid()
         OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3
         OR public.is_current_user_moderator());

-- user_chat_state: moderators may view and manage everyone's state
DROP POLICY IF EXISTS "view own chat state" ON public.user_chat_state;
CREATE POLICY "view own or moderator" ON public.user_chat_state
  FOR SELECT TO authenticated
  USING (user_id = auth.uid()
         OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3
         OR public.is_current_user_moderator());

DROP POLICY IF EXISTS "admins manage chat state" ON public.user_chat_state;
CREATE POLICY "moderators manage chat state" ON public.user_chat_state
  FOR ALL TO authenticated
  USING (public.tier_rank(public.get_user_tier(auth.uid())) >= 3
         OR public.is_current_user_moderator())
  WITH CHECK (public.tier_rank(public.get_user_tier(auth.uid())) >= 3
         OR public.is_current_user_moderator());

GRANT INSERT, UPDATE, DELETE ON public.user_chat_state TO authenticated;

-- Notifications: moderators can send/edit/delete (admin still allowed)
DROP POLICY IF EXISTS "notifications_insert_admin" ON public.notifications;
CREATE POLICY "notifications_insert_mod" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.is_current_user_moderator() AND created_by = auth.uid());

DROP POLICY IF EXISTS "notifications_update_admin" ON public.notifications;
CREATE POLICY "notifications_update_mod" ON public.notifications
  FOR UPDATE TO authenticated
  USING (public.is_current_user_moderator());

DROP POLICY IF EXISTS "notifications_delete_admin" ON public.notifications;
CREATE POLICY "notifications_delete_mod" ON public.notifications
  FOR DELETE TO authenticated
  USING (public.is_current_user_moderator());

DROP POLICY IF EXISTS "notifications_view_targeted_or_broadcast" ON public.notifications;
CREATE POLICY "notifications_view_targeted_or_mod" ON public.notifications
  FOR SELECT TO authenticated
  USING (target_user_id IS NULL
         OR target_user_id = auth.uid()
         OR public.is_current_user_moderator());
