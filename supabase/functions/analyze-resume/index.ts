import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText, jobDesc } = await req.json();
    if (!resumeText || typeof resumeText !== "string" || resumeText.length < 50) {
      return new Response(JSON.stringify({ error: "resumeText too short" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const sys = `You are a senior technical recruiter and ATS expert. Analyze a resume against an optional job description and return strict JSON via the provided tool. Be concise and actionable.`;
    const user = `Resume:\n"""${resumeText.slice(0, 18000)}"""\n\nJob Description (optional):\n"""${(jobDesc || "").slice(0, 6000)}"""\n\nReturn the analysis using the tool.`;

    const tool = {
      type: "function",
      function: {
        name: "resume_analysis",
        description: "Structured ATS resume analysis",
        parameters: {
          type: "object",
          properties: {
            atsScore: { type: "integer", minimum: 0, maximum: 100 },
            summary: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            missingKeywords: { type: "array", items: { type: "string" } },
            matchedKeywords: { type: "array", items: { type: "string" } },
            formattingIssues: { type: "array", items: { type: "string" } },
            grammarIssues: { type: "array", items: { type: "string" } },
            weakBullets: { type: "array", items: { type: "string" } },
            technicalSkills: { type: "array", items: { type: "string" } },
            scoreBreakdown: {
              type: "object",
              properties: {
                keywords: { type: "integer", minimum: 0, maximum: 100 },
                formatting: { type: "integer", minimum: 0, maximum: 100 },
                impact: { type: "integer", minimum: 0, maximum: 100 },
                clarity: { type: "integer", minimum: 0, maximum: 100 },
              },
              required: ["keywords", "formatting", "impact", "clarity"],
              additionalProperties: false,
            },
          },
          required: ["atsScore", "summary", "strengths", "improvements", "missingKeywords", "matchedKeywords", "formattingIssues", "technicalSkills", "scoreBreakdown"],
          additionalProperties: false,
        },
      },
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "resume_analysis" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit, please retry shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI request failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = call?.function?.arguments;
    let parsed: any = null;
    try { parsed = typeof args === "string" ? JSON.parse(args) : args; } catch (_) {}
    if (!parsed) {
      return new Response(JSON.stringify({ error: "Failed to parse AI output" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
