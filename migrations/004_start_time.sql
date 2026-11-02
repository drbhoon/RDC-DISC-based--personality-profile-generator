-- -------------------------------------------------------
-- 004_start_time.sql
--
-- A candidate may not begin before this instant. Set when HR invites a batch
-- (or edited later from the dashboard if a drive slips), and enforced
-- server-side on submit, not just hidden in the UI.
--
-- Full TIMESTAMPTZ (date + time), unlike deadline_at which is a day. Nullable:
-- an assessment with no start time opens immediately, exactly as before.
-- Additive and IF NOT EXISTS — touches no existing rows.
-- -------------------------------------------------------

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ;
