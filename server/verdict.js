/**
 * verdict.js — Verdict engine + critical flags.
 * Pure functions. No side effects. Fully unit-testable.
 *
 * Implements Section 7 of the spec exactly.
 */

// ── HJA Benchmarks (Section 7.1) ──────────────────────────────────────────
const BENCHMARKS = {
  'Sales': {
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
};

/**
 * isInRange: Returns true if score falls within [min, max] inclusive.
 */
function isInRange(score, range) {
  return score >= range.min && score <= range.max;
}

/**
 * getCriticalFlags: Returns array of critical flag description strings.
 * g1 and g2 are objects { D, I, S, C }.
 */
function getCriticalFlags(g1, g2, role) {
  const flags = [];

  if (role === 'Sales') {
    if (g1.I < 55) {
      flags.push('I < 55: Critical deficit — Influence very low for Sales. Relationship warmth is non-negotiable in RMC sales.');
    }
    if (g1.D - g2.D >= 15) {
      flags.push('D collapses under pressure (G1.D - G2.D ≥ 15): Assertiveness disappears at the moments that matter most.');
    }
    if (g1.I - g2.I >= 15) {
      flags.push('I collapses under pressure (G1.I - G2.I ≥ 15): Warmth disappears under stress — damages customer relationships.');
    }
    if (g2.S > 65 && g2.C > 65) {
      flags.push('S > 65 AND C > 65 in G2: Double freeze — over-cautious and rigid simultaneously under pressure.');
    }
  }

  if (role === 'Business Head') {
    if (g1.D < 55) {
      flags.push('G1.D < 55: Insufficient authority drive for mini-CEO role.');
    }
    if (g1.I > 70) {
      flags.push('G1.I > 70: Relationship-drive may dilute commercial authority.');
    }
    if (g1.C > 55) {
      flags.push('G1.C > 55: High C creates analysis paralysis at BH level.');
    }
  }

  return flags;
}

/**
 * getVerdict: Returns 'STRONG FIT' | 'MODERATE FIT' | 'NOT RECOMMENDED'
 * for the assessed role.
 *
 * Verdict rules (Section 7.2):
 *   2+ critical flags OR 3+ dims out of range → NOT RECOMMENDED
 *   1 critical flag OR 2 dims out of range     → MODERATE FIT
 *   1 dim out of range (no critical flags)     → MODERATE FIT
 *   All in range, no critical flags            → STRONG FIT
 */
function getVerdict(g1, g2, role) {
  const benchmark = BENCHMARKS[role];
  if (!benchmark) {
    // Role not benchmarked — return neutral
    return 'NOT ASSESSED';
  }

  const flags = getCriticalFlags(g1, g2, role);
  const dims  = ['D', 'I', 'S', 'C'];
  const outOfRange = dims.filter((d) => !isInRange(g1[d], benchmark[d])).length;

  if (flags.length >= 2 || outOfRange >= 3) {
    return 'NOT RECOMMENDED';
  }
  if (flags.length >= 1 || outOfRange >= 2) {
    return 'MODERATE FIT';
  }
  if (outOfRange === 1) {
    return 'MODERATE FIT';
  }
  return 'STRONG FIT';
}

/**
 * getBenchmarkDetail: Returns per-dimension comparison for the report table.
 * Returns array of { dim, score, band, benchmark, fit }
 */
function getBenchmarkDetail(g1, role) {
  const benchmark = BENCHMARKS[role];
  if (!benchmark) return [];

  const bandLabel = (score) => {
    if (score >= 80) return 'Very High';
    if (score >= 65) return 'High';
    if (score >= 45) return 'Moderate';
    if (score >= 25) return 'Low';
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
