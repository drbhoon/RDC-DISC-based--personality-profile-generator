/**
 * benchmarks.js — HJA benchmark ranges for 6 RDC role families.
 * Used client-side for the benchmark match table in the admin report.
 */

export const BENCHMARKS = {
  'Sales Executive': {
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
};

export const SCORE_BANDS = [
  { label: 'Very High', min: 80, max: 100 },
  { label: 'High',      min: 65, max: 79 },
  { label: 'Moderate',  min: 45, max: 64 },
  { label: 'Low',       min: 25, max: 44 },
  { label: 'Very Low',  min: 0,  max: 24 },
];

export function getBand(score) {
  for (const band of SCORE_BANDS) {
    if (score >= band.min && score <= band.max) return band.label;
  }
  return 'Unknown';
}
