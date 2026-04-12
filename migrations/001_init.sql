-- RDC People Science Platform — Database Migration
-- Run this once on a fresh PostgreSQL 15 database
-- All tables use UUID primary keys and snake_case naming

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- Table: admins
-- Admin user accounts. Single record in MVP but schema
-- supports multiple.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- bcrypt
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: assessments
-- One row per assessment issued.
-- Token is the URL-safe unique key sent to candidate.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name  VARCHAR(200) NOT NULL,
  candidate_email VARCHAR(200),             -- optional, for records only
  role_assessed   VARCHAR(100) NOT NULL,    -- 'Sales Executive', 'Business Head', etc.
  token           VARCHAR(64) UNIQUE NOT NULL, -- crypto.randomBytes(32).toString('hex')
  status          VARCHAR(20) DEFAULT 'pending', -- pending | completed | deleted
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  created_by      UUID REFERENCES admins(id)
);

-- -------------------------------------------------------
-- Table: responses
-- Raw selections for each of 24 rows.
-- One row in this table = one question answered.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS responses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id  UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,  -- 0 to 23
  most_dim       CHAR(1) NOT NULL,  -- D, I, S, or C
  least_dim      CHAR(1) NOT NULL,  -- D, I, S, or C
  submitted_at   TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: results
-- Computed DISC scores for all three graphs plus
-- derived fields.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS results (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id         UUID REFERENCES assessments(id) ON DELETE CASCADE UNIQUE,
  g1_d                  INTEGER,  -- Graph I (Work Mask) scores
  g1_i                  INTEGER,
  g1_s                  INTEGER,
  g1_c                  INTEGER,
  g2_d                  INTEGER,  -- Graph II (Under Pressure) scores
  g2_i                  INTEGER,
  g2_s                  INTEGER,
  g2_c                  INTEGER,
  g3_d                  INTEGER,  -- Graph III (Self Image) scores
  g3_i                  INTEGER,
  g3_s                  INTEGER,
  g3_c                  INTEGER,
  primary_style         CHAR(1),  -- D, I, S, or C
  secondary_style       CHAR(1),
  verdict_assessed_role VARCHAR(30), -- STRONG FIT | MODERATE FIT | NOT RECOMMENDED
  computed_at           TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- Table: ai_reports
-- Stores the full AI-generated report JSON so the API
-- is called only once per assessment.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE UNIQUE,
  report_json   JSONB NOT NULL,       -- full structured report from Claude API
  generated_at  TIMESTAMPTZ DEFAULT NOW(),
  model_used    VARCHAR(100),         -- e.g. claude-sonnet-4-20250514
  status        VARCHAR(20) DEFAULT 'completed' -- completed | failed
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_assessments_token    ON assessments(token);
CREATE INDEX IF NOT EXISTS idx_assessments_status   ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_responses_assessment ON responses(assessment_id);
