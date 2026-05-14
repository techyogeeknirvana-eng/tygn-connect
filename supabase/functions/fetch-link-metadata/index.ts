import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const pick = (html: string, patterns: RegExp[]): string | null => {
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return m[1].trim();
  }
  return null;
};

const absolutize = (url: string | null, base: string): string | null => {
  if (!url) return null;
  try { return new URL(url, base).toString(); } catch { return null; }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'url required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    let target: URL;
    try { target = new URL(url); } catch {
      return new Response(JSON.stringify({ error: 'invalid url' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!['http:', 'https:'].includes(target.protocol)) {
      return new Response(JSON.stringify({ error: 'unsupported protocol' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const res = await fetch(target.toString(), {
      headers: { 'User-Agent': 'Mozilla/5.0 TYGN-LinkPreview/1.0', 'Accept': 'text/html,*/*' },
      redirect: 'follow',
    });
    const html = await res.text();

    const title = pick(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
      /<title[^>]*>([^<]+)<\/title>/i,
    ]);
    const description = pick(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    ]);
    const image = absolutize(pick(html, [
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ]), target.toString());
    const siteName = pick(html, [
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    ]) || target.hostname.replace(/^www\./, '');

    return new Response(JSON.stringify({ title, description, image, siteName, url: target.toString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
