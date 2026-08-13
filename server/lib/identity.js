/**
 * Client for the portal's identity resolver.
 *
 * Every app on the platform links its records to one shared person_id instead
 * of keeping its own idea of who someone is. This turns the e-mail collected at
 * capture time into that id: a returning employee resolves to the person they
 * already are, a walk-in candidate becomes an external person.
 *
 * Talks to the portal over the private Docker network on hr.rdcc.ai
 * (http://portal:3000), so the key never leaves the bridge.
 *
 * Deliberately returns a RESULT rather than throwing, and distinguishes
 * "no such person" from "could not ask". The two need opposite handling:
 * an unknown address is the caller's business, while an unreachable portal
 * must not be allowed to look like a rejection.
 */
const MASTER_API_URL = (process.env.MASTER_API_URL || '').replace(/\/$/, '');
const MASTER_API_KEY = process.env.MASTER_API_KEY || '';

/** False on Railway and local dev, where the portal does not exist. */
function identityConfigured() {
  return Boolean(MASTER_API_URL && MASTER_API_KEY);
}

/**
 * @returns {Promise<
 *   | { ok: true, person: object }
 *   | { ok: false, reason: 'unconfigured' | 'not_found' | 'unavailable', message?: string }
 * >}
 */
async function resolvePerson({ email, name, employeeCode, requireInternal = false, create = true }) {
  if (!identityConfigured()) return { ok: false, reason: 'unconfigured' };
  if (!email) return { ok: false, reason: 'not_found', message: 'No e-mail address given.' };

  try {
    const res = await fetch(`${MASTER_API_URL}/api/identity/resolve`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-master-key': MASTER_API_KEY,
      },
      body: JSON.stringify({
        email,
        name: name || undefined,
        employee_code: employeeCode || undefined,
        require_internal: requireInternal || undefined,
        create,
      }),
      // A slow portal must not hold an HR admin's browser open. Five seconds
      // is far longer than a lookup on the private network ever takes.
      signal: AbortSignal.timeout(5000),
    });

    if (res.status === 404) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, reason: 'not_found', message: body.error };
    }
    if (!res.ok) {
      console.error(`[identity] portal returned ${res.status}`);
      return { ok: false, reason: 'unavailable' };
    }
    return { ok: true, person: await res.json() };
  } catch (err) {
    // Timeout, DNS, connection refused — the portal is down or slow.
    console.error('[identity] resolve failed:', err.message);
    return { ok: false, reason: 'unavailable' };
  }
}

module.exports = { identityConfigured, resolvePerson };
