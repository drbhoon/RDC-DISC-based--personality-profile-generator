/**
 * aiReport.js — Claude API call for generating DISC behavioral reports.
 *
 * Called once per assessment after score computation.
 * Retry once after 30s on failure. Stores full JSON response in DB.
 */

const Anthropic = require('@anthropic-ai/sdk');
const pool = require('./db');

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are an organizational psychologist with deep expertise in the ready-mix concrete (RMC) industry in India. You understand the behavioral demands of every role at RDC Concrete — from plant incharge to Business Head, from sales to QC lab to accounts.  You have been given a candidate's DISC behavioral profile with three graphs. Your job is to generate a comprehensive, honest, actionable behavioral report in JSON format.  DISC FRAMEWORK (for your reference): - D (Dominance): Drive for results, control, challenge. High D = decisive, direct. Low D = cautious, collaborative. - I (Influence): Drive for recognition, relationships. High I = warm, persuasive. Low I = analytical, reserved. - S (Steadiness): Drive for stability, consistency. High S = patient, loyal. Low S = fast-paced, restless. - C (Conscientiousness): Drive for accuracy, quality. High C = precise, systematic. Low C = intuitive, rule-flexible.  SCORE BANDS: Very High (80-100), High (65-79), Moderate (45-64), Low (25-44), Very Low (0-24)  RDC ROLE FAMILIES AND THEIR IDEAL DISC PATTERNS: 1. Business Head (mini-CEO): D High (65-79), I Moderate (45-64), S Low (25-44), C Low (25-44). Must be commercially courageous, self-directed, accountable. 2. Sales Executive: I High-Very High (70-90), D Moderate-High (55-75), S Low-Moderate (40-65), C Low-Moderate (35-60). Relationship-first, persistent, owns pipeline. 3. Technical / QC (Lab, Quality, Compliance): C High (65-79), S Moderate-High (50-70), D Moderate (40-60), I Low-Moderate (35-55). Accuracy, standards, zero-defect mindset. 4. Operations / Plant Incharge (SARTAJ, discipline, ERP, asset care, scheduling, dispatch): C High (60-79), S High (60-79), D Moderate (45-65), I Moderate (40-60). Disciplined execution, team leadership, operational ownership. 5. Accounts / Finance: C Very High (70-90), S High (55-75), I Low-Moderate (35-55), D Low-Moderate (35-55). Precision, compliance, risk-aversion is an asset. 6. Human Resources: I High (65-80), S High (60-75), C Moderate (45-65), D Moderate (40-60). People-first, empathetic, process-conscious, conflict-navigating.  IMPORTANT RULES: - Be direct and honest. Do not soften findings to spare feelings. A mismatch is a mismatch — call it clearly. - Be specific to the RMC industry context. Reference plants, customers, compliance, SARTAJ where relevant. - All role fit ratings must be justified with specific behavioral evidence from the scores. - Write as if briefing a senior HR leader making a real people decision. - Return ONLY valid JSON — no preamble, no markdown, no explanation outside the JSON.`;

function buildUserPrompt({ candidate_name, role_assessed, date, g1, g2, g3, primary_style, secondary_style, verdict }) {
  return `Generate a complete DISC behavioral report for the following candidate.

Candidate Name: ${candidate_name}
Role Assessed For: ${role_assessed}
Assessment Date: ${date}

DISC SCORES:
Graph I (Work Mask — Adapted Style):
  D: ${g1.D}  I: ${g1.I}  S: ${g1.S}  C: ${g1.C}

Graph II (Under Pressure — Natural Drive):
  D: ${g2.D}  I: ${g2.I}  S: ${g2.S}  C: ${g2.C}

Graph III (Self Image — Self-Perception):
  D: ${g3.D}  I: ${g3.I}  S: ${g3.S}  C: ${g3.C}

Primary Style: ${primary_style}
Secondary Style: ${secondary_style}
Verdict for Assessed Role: ${verdict}

Return a JSON object with exactly these keys:
{
  "natural_style": "3-4 sentences describing how this person naturally shows up at work. Specific to their pattern. Reference the RMC plant environment where relevant.",
  "communication_style": "3-4 sentences on how they send and receive information. What gets through to them. What frustrates them.",
  "under_pressure_behavior": "3-4 sentences. The most important section. Name the specific behavioral risk under stress. Reference the collapse or activation pattern. Be direct.",
  "motivators": "2-3 sentences. What conditions bring out their best. Specific to RDC roles.",
  "demotivators": "2-3 sentences. What management styles or environments suppress this profile.",
  "blind_spots": "3-4 sentences. What this pattern cannot see in itself. Name them directly.",
  "strengths_for_rdc": "3-4 sentences. What this person specifically brings that RDC values. Reference commercial, operational, or people contexts.",
  "role_fit": {
    "business_head": { "rating": "Best Fit | Good Fit | Moderate Fit | Not Recommended", "rationale": "2-3 sentences with specific behavioral evidence." },
    "sales_executive": { "rating": "...", "rationale": "..." },
    "technical_qc": { "rating": "...", "rationale": "..." },
    "operations_plant": { "rating": "...", "rationale": "..." },
    "accounts_finance": { "rating": "...", "rationale": "..." },
    "human_resources": { "rating": "...", "rationale": "..." }
  },
  "best_fit_role": "The single role from the six above that best matches this profile. Just the role name.",
  "development_actions": [
    { "area": "Name of behavioral gap", "action": "Specific action in RDC context", "timeline": "30 days | 60 days | 90 days | 6 months" },
    { "area": "...", "action": "...", "timeline": "..." },
    { "area": "...", "action": "...", "timeline": "..." }
  ],
  "manager_guidance": "3-4 sentences. How should the manager of this person communicate with them, set targets, give feedback, and stretch them. Practical and specific.",
  "succession_note": "2-3 sentences. What is this person's likely trajectory. What role could they grow into. What must develop before that happens."
}`;
}

/**
 * generateAndStoreReport: Calls Claude API, parses JSON, stores in ai_reports table.
 * Retries once after 30s on failure. Does NOT throw — marks status as 'failed' if both attempts fail.
 */
async function generateAndStoreReport(assessmentId, scoreData, assessmentMeta) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const params = {
    candidate_name:   assessmentMeta.candidate_name,
    role_assessed:    assessmentMeta.role_assessed,
    date:             new Date().toISOString().slice(0, 10),
    g1:               scoreData.g1,
    g2:               scoreData.g2,
    g3:               scoreData.g3,
    primary_style:    scoreData.primary_style,
    secondary_style:  scoreData.secondary_style,
    verdict:          scoreData.verdict,
  };

  async function callClaude() {
    const message = await client.messages.create({
      model:      MODEL,
      max_tokens: 4000,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: buildUserPrompt(params) }],
    });
    const rawText = message.content[0].text;
    // Strip any accidental markdown fences
    const jsonText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(jsonText);
  }

  let reportJson = null;
  let failed = false;

  try {
    reportJson = await callClaude();
  } catch (err) {
    console.error(`[aiReport] First attempt failed for ${assessmentId}:`, err.message);
    // Retry once after 30s
    await new Promise((r) => setTimeout(r, 30000));
    try {
      reportJson = await callClaude();
    } catch (err2) {
      console.error(`[aiReport] Second attempt failed for ${assessmentId}:`, err2.message);
      failed = true;
    }
  }

  if (failed || !reportJson) {
    await pool.query(
      `INSERT INTO ai_reports (assessment_id, report_json, model_used, status)
       VALUES ($1, $2, $3, 'failed')
       ON CONFLICT (assessment_id) DO UPDATE
         SET report_json = EXCLUDED.report_json,
             model_used  = EXCLUDED.model_used,
             status      = 'failed',
             generated_at = NOW()`,
      [assessmentId, JSON.stringify({ error: 'Generation failed' }), MODEL]
    );
    return null;
  }

  await pool.query(
    `INSERT INTO ai_reports (assessment_id, report_json, model_used, status)
     VALUES ($1, $2, $3, 'completed')
     ON CONFLICT (assessment_id) DO UPDATE
       SET report_json  = EXCLUDED.report_json,
           model_used   = EXCLUDED.model_used,
           status       = 'completed',
           generated_at = NOW()`,
    [assessmentId, JSON.stringify(reportJson), MODEL]
  );

  return reportJson;
}

module.exports = { generateAndStoreReport };
