import { createClient } from 'npm:@supabase/supabase-js@2.75.0';

/* Free, domain-free backup recovery for a single approved Lånesjekk Studio admin.
 * No password reset without a 256-bit one-time recovery code already generated
 * by an authenticated administrator. Tokens never enter the database in plaintext.
 */
const TABLE = 'lanesjekk_admin_recovery_codes';
const ORIGINS = new Set([
  'https://lanesjekk-norge.onrender.com',
  'https://lanesjekk-norge.vercel.app'
]);
const url = Deno.env.get('SUPABASE_URL') || '';
const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const secret = keys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const adminClient = url && secret ? createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false }
}) : null;

function response(body, status = 200, origin = '') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'Vary': 'Origin',
      ...(ORIGINS.has(origin) ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      } : {})
    }
  });
}
function randomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
async function hashCode(code) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
async function isAdmin(userId) {
  const { data, error } = await adminClient.from('admins')
    .select('user_id').eq('user_id', userId).maybeSingle();
  return !error && !!data;
}
Deno.serve(async req => {
  const origin = req.headers.get('origin') || '';
  if (!ORIGINS.has(origin)) return response({ error: 'Ikke tillatt opprinnelse.' }, 403, origin);
  if (req.method === 'OPTIONS') return response({}, 200, origin);
  if (req.method !== 'POST') return response({ error: 'Metode ikke støttet.' }, 405, origin);
  if (!adminClient) return response({ error: 'Gjenoppretting er ikke tilgjengelig akkurat nå.' }, 503, origin);
  if (Number(req.headers.get('content-length') || 0) > 4096)
    return response({ error: 'Forespørselen er for stor.' }, 413, origin);

  let body;
  try { body = await req.json(); } catch { return response({ error: 'Ugyldig forespørsel.' }, 400, origin); }
  if (!body || typeof body !== 'object') return response({ error: 'Ugyldig forespørsel.' }, 400, origin);

  if (body.action === 'generate') {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
    if (!token || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token))
      return response({ error: 'Logg inn som administrator først.' }, 401, origin);
    const { data: auth, error: authError } = await adminClient.auth.getUser(token);
    if (authError || !auth?.user || !(await isAdmin(auth.user.id)))
      return response({ error: 'Bare godkjente administratorer kan opprette reservekoder.' }, 403, origin);

    const now = new Date();
    const { data: latest } = await adminClient.from(TABLE).select('created_at')
      .eq('user_id', auth.user.id).order('created_at', { ascending: false }).limit(1);
    if (latest?.[0] && now.getTime() - new Date(latest[0].created_at).getTime() < 120000)
      return response({ error: 'Reservekoder ble nettopp opprettet. Prøv igjen om to minutter.' }, 429, origin);
    const generation = crypto.randomUUID();
    const expiresAt = new Date(now.getTime() + 365 * 86400 * 1000).toISOString();
    const codes = Array.from({ length: 3 }, () => randomCode());
    const hashes = await Promise.all(codes.map(hashCode));
    const { error: insertError } = await adminClient.from(TABLE).insert(hashes.map(code_hash => ({
      user_id: auth.user.id, code_hash, generation_id: generation, expires_at: expiresAt
    })));
    if (insertError) return response({ error: 'Kunne ikke opprette reservekoder nå.' }, 503, origin);
    const { error: deleteError } = await adminClient.from(TABLE).delete()
      .eq('user_id', auth.user.id).neq('generation_id', generation);
    if (deleteError) console.error('Failed to expire earlier backup generations');
    return response({ codes, expiresAt, message: 'Lagre kodene sikkert. De vises bare én gang.' }, 200, origin);
  }

  if (body.action === 'recover') {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (email.length < 3 || email.length > 254 || !email.includes('@') ||
      !/^[A-Za-z0-9_-]{43}$/.test(code) || password.length < 8 || password.length > 128)
      return response({ error: 'Kontroller e-postadresse, reservekode og passord (minst 8 tegn).' }, 400, origin);

    const codeHash = await hashCode(code);
    const { data: candidate, error: lookupError } = await adminClient.from(TABLE)
      .select('id,user_id').eq('code_hash', codeHash)
      .is('used_at', null).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (lookupError) return response({ error: 'Gjenoppretting er ikke tilgjengelig akkurat nå.' }, 503, origin);
    const genericError = { error: 'Ugyldig eller allerede brukt reservekode. Kontroller e-post og kode.' };
    if (!candidate || !(await isAdmin(candidate.user_id)))
      return response(genericError, 400, origin);
    const { data: found, error: userError } = await adminClient.auth.admin.getUserById(candidate.user_id);
    if (userError || !found?.user || (found.user.email || '').toLowerCase() !== email)
      return response(genericError, 400, origin);

    // Claim the code atomically before making any privileged password change.
    const claimedAt = new Date().toISOString();
    const { data: claimed, error: consumeError } = await adminClient.from(TABLE)
      .update({ used_at: claimedAt }).eq('id', candidate.id)
      .is('used_at', null).gt('expires_at', claimedAt).select('id').maybeSingle();
    if (consumeError || !claimed) return response(genericError, 400, origin);

    const { error: resetError } = await adminClient.auth.admin.updateUserById(candidate.user_id, { password });
    if (resetError) return response({
      error: 'Passordet ble ikke endret. Kontroller passordkravene og bruk en annen ubrukt reservekode.'
    }, 503, origin);
    return response({ success: true }, 200, origin);
  }
  return response({ error: 'Ukjent forespørsel.' }, 400, origin);
});
