
-- ============ Helper: get tier ============
CREATE OR REPLACE FUNCTION public.get_user_tier(_uid uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT CASE
    WHEN (SELECT email FROM auth.users WHERE id = _uid) = 'techyogeeknirvana@gmail.com' THEN 'supreme'
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid AND role = 'co_admin') THEN 'co_admin'
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid AND role = 'elite') THEN 'elite'
    ELSE 'operator'
  END
$$;

CREATE OR REPLACE FUNCTION public.tier_rank(_tier text)
RETURNS int LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE _tier
    WHEN 'supreme' THEN 4
    WHEN 'co_admin' THEN 3
    WHEN 'elite' THEN 2
    ELSE 1
  END
$$;

-- ============ Channels ============
CREATE TABLE IF NOT EXISTS public.channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'public' CHECK (category IN ('public','elite','admin')),
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.channels TO authenticated;
GRANT ALL ON public.channels TO service_role;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_view_channel(_uid uuid, _category text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.tier_rank(public.get_user_tier(_uid))
       >= public.tier_rank(CASE _category
            WHEN 'admin' THEN 'co_admin'
            WHEN 'elite' THEN 'elite'
            ELSE 'operator' END)
$$;

CREATE POLICY "view channels by tier" ON public.channels
  FOR SELECT TO authenticated
  USING (public.can_view_channel(auth.uid(), category));

CREATE POLICY "admins manage channels" ON public.channels
  FOR ALL TO authenticated
  USING (public.tier_rank(public.get_user_tier(auth.uid())) >= 3)
  WITH CHECK (public.tier_rank(public.get_user_tier(auth.uid())) >= 3);

-- ============ Chat messages ============
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) BETWEEN 1 AND 4000),
  reply_to_id uuid REFERENCES public.chat_messages(id) ON DELETE SET NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  sticker text,
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz
);
CREATE INDEX IF NOT EXISTS chat_messages_channel_idx ON public.chat_messages(channel_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view messages in viewable channels" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.channels c
    WHERE c.id = chat_messages.channel_id
      AND public.can_view_channel(auth.uid(), c.category)
  ));

CREATE POLICY "post in viewable channels" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.channels c
      WHERE c.id = chat_messages.channel_id
        AND public.can_view_channel(auth.uid(), c.category)
    )
  );

CREATE POLICY "edit own messages" ON public.chat_messages
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3)
  WITH CHECK (user_id = auth.uid() OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3);

CREATE POLICY "delete own or admin" ON public.chat_messages
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3);

-- ============ Reactions ============
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);
GRANT SELECT, INSERT, DELETE ON public.message_reactions TO authenticated;
GRANT ALL ON public.message_reactions TO service_role;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "react where viewable" ON public.message_reactions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.chat_messages m JOIN public.channels c ON c.id = m.channel_id
    WHERE m.id = message_reactions.message_id AND public.can_view_channel(auth.uid(), c.category)
  ));

CREATE POLICY "add own reaction" ON public.message_reactions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "remove own reaction" ON public.message_reactions
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============ Chat state (ban/mute/limits) ============
CREATE TABLE IF NOT EXISTS public.user_chat_state (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  banned boolean NOT NULL DEFAULT false,
  muted_until timestamptz,
  transmissions_used int NOT NULL DEFAULT 0,
  transmissions_date date NOT NULL DEFAULT CURRENT_DATE,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_chat_state TO authenticated;
GRANT ALL ON public.user_chat_state TO service_role;
ALTER TABLE public.user_chat_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view own chat state" ON public.user_chat_state
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.tier_rank(public.get_user_tier(auth.uid())) >= 3);

CREATE POLICY "admins manage chat state" ON public.user_chat_state
  FOR ALL TO authenticated
  USING (public.tier_rank(public.get_user_tier(auth.uid())) >= 3)
  WITH CHECK (public.tier_rank(public.get_user_tier(auth.uid())) >= 3);

-- ============ Enforce ban/mute/daily transmissions ============
CREATE OR REPLACE FUNCTION public.enforce_chat_rules()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  tier text;
  st public.user_chat_state%ROWTYPE;
BEGIN
  tier := public.get_user_tier(NEW.user_id);
  SELECT * INTO st FROM public.user_chat_state WHERE user_id = NEW.user_id;

  IF st.banned THEN
    RAISE EXCEPTION 'BANNED' USING ERRCODE = 'P0001';
  END IF;
  IF st.muted_until IS NOT NULL AND st.muted_until > now() THEN
    RAISE EXCEPTION 'MUTED' USING ERRCODE = 'P0002';
  END IF;

  IF tier = 'operator' THEN
    INSERT INTO public.user_chat_state(user_id, transmissions_used, transmissions_date)
    VALUES (NEW.user_id, 1, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE
      SET transmissions_used = CASE
            WHEN public.user_chat_state.transmissions_date = CURRENT_DATE
              THEN public.user_chat_state.transmissions_used + 1
            ELSE 1 END,
          transmissions_date = CURRENT_DATE,
          updated_at = now();
    IF (SELECT transmissions_used FROM public.user_chat_state WHERE user_id = NEW.user_id) > 10 THEN
      RAISE EXCEPTION 'BANDWIDTH_EXHAUSTED' USING ERRCODE = 'P0003';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS chat_rules ON public.chat_messages;
CREATE TRIGGER chat_rules BEFORE INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_chat_rules();

-- ============ Realtime ============
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- ============ Seed channels ============
INSERT INTO public.channels (slug, name, description, category, position) VALUES
  ('announcements', 'announcements', 'Network-wide broadcasts from command', 'public', 0),
  ('general', 'general', 'Open frequency. All operators welcome.', 'public', 1),
  ('projects', 'projects', 'Ship logs, demos, collabs.', 'public', 2),
  ('elite-lounge', 'elite-lounge', 'Restricted channel for elite operators.', 'elite', 3),
  ('admin-ops', 'admin-ops', 'Command and control. Admins only.', 'admin', 4)
ON CONFLICT (slug) DO NOTHING;
