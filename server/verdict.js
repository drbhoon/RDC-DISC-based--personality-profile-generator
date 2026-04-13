/**
 * verdict.js — Verdict engine + critical flags.
 * Pure functions. No side effects. Fully unit-testable.
 */

// ── HJA Benchmarks — all 6 RDC role families ─────────────────────────────
const BENCHMARKS = {
  // Also matched by legacy key 'Sales Executive' stored in older DB rows
  'Sales': {
    D: { min: 55, max: 75 },
    I: { min: 70, max: 90 },
    S: { min: 40, max: 65 },
    C: { min: 35, max: 60 },
    pattern: 'I/D',
  },
  'Sales Executive': {   // legacy alias — same ranges
    D: { min: 55, max: 75 },
    I: { min: 70, max: 90 },
    S: { min: 40, max: 65 },
    C: { min: 35, max: 60 },
    pattern: 'I/D',
  },
  'Business Head': {
    D: { min: 65, max: 79 },
    I: { min: 45, max: 64 },
    S: { min: 25, max: 44 },
    C: { min: 25, max: 44 },
    pattern: 'D/I',
  },
  'Technical / QC': {
    D: { min: 40, max: 60 },
    I: { min: 35, max: 55 },
    S: { min: 50, max: 70 },
    C: { min: 65, max: 79 },
    pattern: 'C/S',
  },
  'Operations / Plant Incharge': {
    D: { min: 45, max: 65 },
    I: { min: 40, max: 60 },
    S: { min: 60, max: 79 },
    C: { min: 60, max: 79 },
    pattern: 'C/S',
  },
  'Accounts / Finance': {
    D: { min: 35, max: 55 },
    I: { min: 35, max: 55 },
    S: { min: 55, max: 75 },
    C: { min: 70, max: 90 },
    pattern: 'C/S',
  },
  'Human Resources': {
    D: { min: 40, max: 60 },
    I: { min: 65, max: 80 },
    S: { min: 60, max: 75 },
    C: { min: 45, max: 65 },
    pattern: 'I/S',
  },
  // 'Others' has no benchmark — verdict returns 'NOT ASSESSED' (correct behaviour)
};

function isInRange(score, range) {
  return score >= range.min && score <= range.max;
}

function getCriticalFlags(g1, g2, role) {
  const flags = [];

  if (role === 'Sales' || role === 'Sales Executive') {
    if (g1.I < 55)
      flags.push('I < 55: Critical deficit — Influence very low for Sales. Relationship warmth is non-negotiable in RMC sales.');
    if (g1.D - g2.D >= 15)
      flags.push('D collapses under pressure (G1.D − G2.D ≥ 15): Assertiveness disappears at the moments that matter most.');
    if (g1.I - g2.I >= 15)
      flags.push('I collapses under pressure (G1.I − G2.I ≥ 15): Warmth disappears under stress — damages customer relationships.');
    if (g2.S > 65 && g2.C > 65)
      flags.push('S > 65 AND C > 65 in G2: Double freeze — over-cautious and rigid simultaneously under pressure.');
  }

  if (role === 'Business Head') {
    if (g1.D < 55)
      flags.push('G1.D < 55: Insufficient authority drive for mini-CEO role.');
    if (g1.I > 70)
      flags.push('G1.I > 70: Relationship-drive may dilute commercial authority.');
    if (g1.C > 55)
      flags.push('G1.C > 55: High C creates analysis paralysis at BH level.');
  }

  if (role === 'Technical / QC') {
    if (g1.C < 55)
      flags.push('G1.C < 55: Insufficient precision drive for QC/Technical role — accuracy and compliance standards at risk.');
    if (g1.D > 70)
      flags.push('G1.D > 70: Very high dominance may create friction with process discipline required in QC.');
  }

  if (role === 'Operations / Plant Incharge') {
    if (g1.S < 50)
      flags.push('G1.S < 50: Low steadiness — consistency and team stability may suffer in plant operations.');
    if (g1.C < 50)
      flags.push('G1.C < 50: Low conscientiousness — SARTAJ discipline and ERP adherence may be weak.');
    if (g2.D > 70)
      flags.push('G2.D > 70 under pressure: May become overly autocratic under operational stress — team impact risk.');
  }

  if (role === 'Accounts / Finance') {
    if (g1.C < 65)
      flags.push('G1.C < 65: Accuracy and compliance drive insufficient for Finance role — error risk is high.');
    if (g1.I > 65)
      flags.push('G1.I > 65: High Influence may lead to shortcuts or relationship-bias in financial decision-making.');
  }

  if (role === 'Human Resources') {
    if (g1.I < 55)
      flags.push('G1.I < 55: Low Influence — insufficient people-connect for an HR role in a diverse plant workforce.');
    if (g1.S < 50)
      flags.push('G1.S < 50: Low steadiness — patience and empathy under conflict situations may be limited.');
    if (g2.D > 70)
      flags.push('G2.D > 70 under pressure: May become confrontational under conflict — antithetical to HR mediation role.');
  }

  return flags;
}

function getVerdict(g1, g2, role) {
  const benchmark = BENCHMARKS[role];
  if (!benchmark) {
    return 'NOT ASSESSED';  // 'Others' or unknown role
  }

  const flags      = getCriticalFlags(g1, g2, role);
  const outOfRange = ['D', 'I', 'S', 'C'].filter((d) => !isInRange(g1[d], benchmark[d])).length;

  if (flags.length >= 2 || outOfRange >= 3) return 'NOT RECOMMENDED';
  if (flags.length >= 1 || outOfRange >= 2) return 'MODERATE FIT';
  if (outOfRange === 1)                      return 'MODERATE FIT';
  return 'STRONG FIT';
}

function getBenchmarkDetail(g1, role) {
  const benchmark = BENCHMARKS[role];
  if (!benchmark) return [];

  const bandLabel = (s) => {
    if (s >= 80) return 'Very High';
    if (s >= 65) return 'High';
    if (s >= 45) return 'Moderate';
    if (s >= 25) return 'Low';
    return 'Very Low';
  };

  return ['D', 'I', 'S', 'C'].map((dim) => ({
    dim,
    score: g1[dim],
    band: bandLabel(g1[dim]),
    benchmark: `${benchmark[dim].min}–${benchmark[dim].max}`,
    fit: isInRange(g1[dim], benchmark[dim]) ? 'In Range' : 'Out of Range',
  }));
}

module.exports = { getVerdict, getCriticalFlags, getBenchmarkDetail, BENCHMARKS };
