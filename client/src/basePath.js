/**
 * Mount prefix for the app, without a trailing slash.
 *
 * Vite sets import.meta.env.BASE_URL from the `base` option in
 * vite.config.js — "/disc/" on the HR platform, "/" everywhere else. Trimming
 * the trailing slash gives "/disc" or "", so BASE + "/api" composes cleanly
 * and root-mounted builds are unaffected.
 */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path) => `${BASE}${path}`;
