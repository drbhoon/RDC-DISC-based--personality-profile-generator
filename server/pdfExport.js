/**
 * pdfExport.js — Server-side PDF generation via Puppeteer.
 *
 * Renders the admin report page (/admin/report/:id) as a PDF and
 * returns the buffer. Called from the admin route GET /api/admin/assessments/:id/pdf
 */

const puppeteer = require('puppeteer');

/**
 * generateReportPDF: Headless-renders the admin report page and returns a PDF buffer.
 *
 * @param {string} reportUrl - Full URL of the admin report page, including the JWT cookie
 * @param {string} authToken - JWT to inject so the page loads the protected route
 * @returns {Buffer} PDF buffer
 */
async function generateReportPDF(reportUrl, authToken) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  try {
    const page = await browser.newPage();

    // Inject auth token into localStorage before navigation
    await page.evaluateOnNewDocument((token) => {
      localStorage.setItem('rdc_admin_token', token);
    }, authToken);

    await page.goto(reportUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for report content to render
    await page.waitForSelector('[data-pdf-ready]', { timeout: 30000 }).catch(() => {
      // If selector not found, give the page extra time
      return new Promise((r) => setTimeout(r, 3000));
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = { generateReportPDF };
