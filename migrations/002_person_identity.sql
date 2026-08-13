-- -------------------------------------------------------
-- 002_person_identity.sql
--
-- Link every DISC assessment to the shared person spine in the portal, so a
-- candidate's profile can be found alongside whatever else they have done
-- here — an appraisal, an SRT, a Kaushal test.
--
-- Until now this table recorded a name and an OPTIONAL e-mail described in
-- 001 as "for records only". That is why DISC results could not be tied to
-- anybody: there was nothing reliable to tie them by.
--
-- DISC stays open to non-employees (recruitment candidates, external
-- participants), so person_id may point at an external person. What it may
-- not be is absent.
-- -------------------------------------------------------

-- The portal's id for this candidate. Nullable ON PURPOSE: if the portal is
-- unreachable when HR creates an assessment, the assessment is still created
-- and this is filled in later. A failed lookup must not stop work.
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS person_id BIGINT;

-- The address exactly as it was typed, kept beside the resolved id. The
-- address book can change afterwards — a transfer, a correction — and without
-- this there would be no record of what the link was actually made from.
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS captured_email VARCHAR(200);

-- Rows created before this migration have no captured address; copy across
-- whatever the old optional column happens to hold, so the backfill has
-- something to work with.
UPDATE assessments
   SET captured_email = lower(trim(candidate_email))
 WHERE captured_email IS NULL
   AND candidate_email IS NOT NULL
   AND trim(candidate_email) <> '';

CREATE INDEX IF NOT EXISTS assessments_person_idx ON assessments(person_id);
CREATE INDEX IF NOT EXISTS assessments_captured_email_idx ON assessments(captured_email);
