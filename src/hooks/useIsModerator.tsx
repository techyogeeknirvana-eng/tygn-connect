import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const useIsModerator = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user) { setIsModerator(false); setLoading(false); return; }
      if (isAdmin) { setIsModerator(true); setLoading(false); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "moderator")
        .maybeSingle();
      setIsModerator(!!data);
      setLoading(false);
    };
    if (!adminLoading) check();
  }, [user, isAdmin, adminLoading]);

  return { isModerator, isAdmin, loading: loading || adminLoading };
};
