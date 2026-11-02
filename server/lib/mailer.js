/**
 * mailer.js — Sends the DISC assessment invitation e-mail.
 *
 * Transport is plain SMTP via nodemailer, deliberately the SAME scheme the RDC
 * LMS already runs on (SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER /
 * SMTP_PASSWORD / SMTP_FROM). HR sets the identical values for the `disc`
 * service on the Azure server, so nothing new has to be procured.
 *
 * The transport is built lazily and cached, so simply requiring this module
 * never needs configuration — the message builder below is a pure function and
 * can be exercised without any SMTP at all.
 */

const nodemailer = require('nodemailer');

// Same SMTP settings as every other HR app on the platform — the single shared
// .env supplies SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM, and
// SMTP_FROM is the standard noreply@rdc.in. (The LMS is the lone app that reads
// SMTP_PASSWORD; compose remaps it. DISC uses the plain SMTP_PASS everyone else
// does, so the disc service needs no special remapping.)
function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let _transport = null;
function transport() {
  if (_transport) return _transport;
  _transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
  return _transport;
}

const FROM = () => process.env.SMTP_FROM || process.env.SMTP_USER;

const escapeHtml = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A plain date like "9 Nov 2026". deadline is 'YYYY-MM-DD' (or empty).
function formatDeadline(deadline) {
  if (!deadline) return '';
  const d = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Pure builder: given the candidate details and link, return the e-mail's
 * subject, text and html. No I/O — this is what the tests cover.
 */
function buildInvite({ name, role, link, deadline }) {
  const by = formatDeadline(deadline);
  const subject = 'RDC Behavioural Assessment — your personal link';

  const lines = [
    `Dear ${name},`,
    '',
    `You have been invited to complete the RDC behavioural assessment (DISC)${role ? ` for the role of ${role}` : ''}.`,
    'It takes about 10–15 minutes and should be done in one sitting.',
    by ? `Please complete it by ${by}.` : '',
    '',
    `Open your assessment: ${link}`,
    '',
    'A few things to keep in mind:',
    '• There are no right or wrong answers — answer honestly.',
    '• Go with your first instinct; it is usually the truest.',
    '• The link is personal to you, so please do not share it.',
    '',
    'Regards,',
    'RDC HR',
  ].filter((l) => l !== '' || true); // keep blank lines for spacing

  const text = lines.join('\n');

  const htmlLines = lines
    .filter((l) => l.trim() !== '')
    .map((l) => {
      if (l.startsWith('Open your assessment:')) {
        return `<p>Open your assessment: <a href="${link}">${escapeHtml(link)}</a></p>`;
      }
      return `<p style="margin:0 0 10px">${escapeHtml(l)}</p>`;
    })
    .join('');
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;line-height:1.5">${htmlLines}</div>`;

  return { subject, text, html };
}

/**
 * Send one invitation. Throws if SMTP is not configured or the send fails, so
 * the route can report a per-candidate outcome.
 */
async function sendInvite({ to, name, role, link, deadline }) {
  if (!isSmtpConfigured()) throw new Error('SMTP is not configured on this server');
  const { subject, text, html } = buildInvite({ name, role, link, deadline });
  await transport().sendMail({ from: FROM(), to, subject, text, html });
}

module.exports = { isSmtpConfigured, buildInvite, sendInvite };
