-- Migration: Add registration deadline to events
-- Run this in Supabase SQL Editor

ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_end_time TEXT;

-- Optional: backfill nothing; NULL means "registrations stay open until the event starts"
SELECT id, title, date, time, registration_end_time FROM events ORDER BY date DESC;
