import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: authErr } = await supabase.auth.getClaims(token);
    if (authErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, mode, company, role, difficulty, messages, questionCount } = body as {
      action: "chat" | "report";
      mode: "dsa" | "hr" | "system_design" | "behavioral";
      company?: string;
      role?: string;
      difficulty?: "easy" | "medium" | "hard";
      messages: { role: "user" | "assistant"; content: string }[];
      questionCount?: number;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const modeMap: Record<string, string> = {
      dsa: "Data Structures & Algorithms coding round (LeetCode-style). Ask ONE problem at a time, request approach first, then complexity analysis, then edge cases. Never give away the solution unless the candidate is fully stuck after two hints.",
      system_design: "Senior system design round. Guide with probing follow-ups on scale, data model, bottlenecks, tradeoffs. Do not lecture; ask.",
      hr: "HR / behavioral round. Focus on motivation, teamwork, conflict, leadership. Follow the STAR method quietly and probe for specifics.",
      behavioral: "Behavioral deep-dive. Ask for concrete stories, then probe outcomes and metrics.",
    };

    const persona = `You are a SENIOR interviewer at ${company || "a top tech company"} conducting a ${difficulty || "medium"}-difficulty ${mode.toUpperCase()} interview for a ${role || "Software Engineer"} role.
${modeMap[mode] || modeMap.hr}

RULES:
- Sound like a real human interviewer. Be warm but sharp.
- Ask ONE question at a time. Never dump multiple questions.
- After the candidate answers, silently rate their answer 1-10 and give a SHORT reaction (1-2 sentences), then either probe deeper OR move to the next question.
- Never break character. Never mention you are an AI.
- Keep responses under 120 words.
- Session length: ~${questionCount || 5} main questions, then end with "Alright, that wraps up our interview." on the last turn.`;

    if (action === "report") {
      const tool = {
        type: "function",
        function: {
          name: "interview_report",
          description: "Generate structured post-interview feedback",
          parameters: {
            type: "object",
            properties: {
              overallScore: { type: "integer", minimum: 0, maximum: 100 },
              verdict: { type: "string", enum: ["strong_hire", "hire", "lean_hire", "no_hire", "strong_no_hire"] },
              summary: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              weaknesses: { type: "array", items: { type: "string" } },
              actionPlan: { type: "array", items: { type: "string" } },
              scoreBreakdown: {
                type: "object",
                properties: {
                  technical: { type: "integer" },
                  communication: { type: "integer" },
                  problemSolving: { type: "integer" },
                  confidence: { type: "integer" },
                },
                required: ["technical", "communication", "problemSolving", "confidence"],
                additionalProperties: false,
              },
              questionReviews: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    answerRating: { type: "integer", minimum: 0, maximum: 10 },
                    idealAnswer: { type: "string" },
                    feedback: { type: "string" },
                  },
                  required: ["question", "answerRating", "feedback"],
                  additionalProperties: false,
                },
              },
            },
            required: ["overallScore", "verdict", "summary", "strengths", "weaknesses", "actionPlan", "scoreBreakdown", "questionReviews"],
            additionalProperties: false,
          },
        },
      };

      const transcript = messages.map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`).join("\n\n");
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: `You are a hiring manager writing a rigorous, honest post-interview scorecard for a ${mode} round at ${company || "a top company"} for a ${role || "SWE"} role. Be specific and actionable.` },
            { role: "user", content: `Interview transcript:\n\n${transcript}\n\nProduce the structured report.` },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "interview_report" } },
        }),
      });

      if (!resp.ok) {
        const t = await resp.text();
        console.error("AI report err", resp.status, t);
        return new Response(JSON.stringify({ error: "Report generation failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const data = await resp.json();
      const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      const parsed = typeof args === "string" ? JSON.parse(args) : args;
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // chat turn
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: persona }, ...messages],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI err", resp.status, t);
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit, retry shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI request failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content ?? "…";
    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
