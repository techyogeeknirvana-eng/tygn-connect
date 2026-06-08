import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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

// Block private IP ranges and loopback to prevent SSRF
const isPrivateHost = (host: string): boolean => {
  const h = host.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return true;
  // IPv4 literal
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1]), parseInt(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true; // multicast / reserved
  }
  // IPv6 loopback / link-local / ULA
  if (h === '::1' || h === '[::1]' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80') || h.startsWith('[fc') || h.startsWith('[fd') || h.startsWith('[fe80')) return true;
  return false;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
    if (isPrivateHost(target.hostname)) {
      return new Response(JSON.stringify({ error: 'forbidden host' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const res = await fetch(target.toString(), {
      headers: { 'User-Agent': 'Mozilla/5.0 TYGN-LinkPreview/1.0', 'Accept': 'text/html,*/*' },
      redirect: 'follow',
    });
    // Re-check final URL after redirects
    try {
      const finalUrl = new URL(res.url);
      if (isPrivateHost(finalUrl.hostname)) {
        return new Response(JSON.stringify({ error: 'forbidden redirect target' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch {}
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
