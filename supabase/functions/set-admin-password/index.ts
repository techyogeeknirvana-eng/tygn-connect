import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const ADMIN_EMAIL = "techyogeeknirvana@gmail.com";
    const ADMIN_PASSWORD = "TYGN@123tygn";

    // List users (paged) and find admin
    let userId: string | null = null;
    let page = 1;
    while (page < 20 && !userId) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const found = data.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL);
      if (found) userId = found.id;
      if (data.users.length < 200) break;
      page++;
    }

    if (userId) {
      const { error } = await admin.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (error) throw error;
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "TYGN Admin" },
      });
      if (error) throw error;
      userId = data.user?.id ?? null;
    }

    // Ensure profile exists & approved
    if (userId) {
      await admin.from("profiles").upsert(
        {
          id: userId,
          full_name: "TYGN Admin",
          approval_status: "approved",
          approved_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    }

    return new Response(JSON.stringify({ ok: true, userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
