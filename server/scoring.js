/**
 * scoring.js — Pure DISC score computation functions.
 * No side effects. Fully unit-testable.
 *
 * Implements the exact formulas from the spec (Section 6).
 */

const DIMS = ['D', 'I', 'S', 'C'];

/**
 * rawToScore: Maps a raw delta to a 0–100 scale.
 * Formula: Math.max(0, Math.min(100, Math.round(((raw + max) / (2 * max)) * 100)))
 *
 * @param {number} raw - Raw delta value
 * @param {number} max - Maximum absolute value for the formula
 * @returns {number} Score 0–100
 */
function rawToScore(raw, max) {
  return Math.max(0, Math.min(100, Math.round(((raw + max) / (2 * max)) * 100)));
}

/**
 * computeScores: Given 24 raw responses, returns all three DISC graphs,
 * primary style, secondary style.
 *
 * @param {Array<{most_dim: string, least_dim: string}>} responses - Array of 24 responses (0-indexed)
 * @returns {{
 *   g1: {D,I,S,C}, g2: {D,I,S,C}, g3: {D,I,S,C},
 *   primary_style: string, secondary_style: string
 * }}
 */
function computeScores(responses) {
  // Tally most and least counts per dimension
  const most  = { D: 0, I: 0, S: 0, C: 0 };
  const least = { D: 0, I: 0, S: 0, C: 0 };

  for (const r of responses) {
    if (DIMS.includes(r.most_dim))  most[r.most_dim]++;
    if (DIMS.includes(r.least_dim)) least[r.least_dim]++;
  }

  // Graph I — Work Mask: rawToScore(most[d] - 6, 18)
  const g1 = {};
  for (const d of DIMS) {
    g1[d] = rawToScore(most[d] - 6, 18);
  }

  // Graph II — Under Pressure: rawToScore(most[d] - least[d], 24)
  const g2 = {};
  for (const d of DIMS) {
    g2[d] = rawToScore(most[d] - least[d], 24);
  }

  // Graph III — Self Image: rawToScore(-least[d] + 6, 18)
  const g3 = {};
  for (const d of DIMS) {
    g3[d] = rawToScore(-least[d] + 6, 18);
  }

  // Derive primary and secondary from G1 descending
  const sortedByG1 = [...DIMS].sort((a, b) => g1[b] - g1[a]);
  const primary_style   = sortedByG1[0];
  const secondary_style = sortedByG1[1];

  return { g1, g2, g3, primary_style, secondary_style, most, least };
}

module.exports = { computeScores, rawToScore, DIMS };
