-- Migration: Store per-registration consent (privacy policy + media usage)
-- Run this in Supabase SQL Editor

ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS media_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;

-- Optional: quick audit of who has not consented yet
-- (event_registrations has no created_at column; it uses registered_at)
SELECT id, name, event_id, privacy_consent, media_consent, consent_at
FROM event_registrations
ORDER BY registered_at DESC
LIMIT 50;
