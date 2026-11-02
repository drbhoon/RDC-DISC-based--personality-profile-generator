-- -------------------------------------------------------
-- 003_invite_tracking.sql
--
-- Adds the two timestamps the "Schedule & Invite" action needs:
--
--   deadline_at — the "please complete by" date HR sets when inviting a
--                 batch. Shown in the invitation e-mail and on the dashboard.
--                 Nullable: an invite may go out with no fixed deadline.
--
--   invited_at  — when the invitation e-mail was last sent to this candidate.
--                 Lets the dashboard show who has already been contacted so a
--                 batch is not mailed to the same people twice by accident.
--
-- Both are plain columns on assessments; no new table. Idempotent like every
-- migration here (re-run safe), because migrate.js replays them on every boot.
-- -------------------------------------------------------

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS deadline_at TIMESTAMPTZ;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS invited_at  TIMESTAMPTZ;
