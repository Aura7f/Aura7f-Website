CREATE TABLE IF NOT EXISTS clans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE clans ENABLE ROW LEVEL SECURITY;

-- Allow public read access (re-runnable)
DROP POLICY IF EXISTS "Allow public read access on clans" ON clans;
CREATE POLICY "Allow public read access on clans" ON clans FOR SELECT USING (true);

-- Insert the initial 4 clans
INSERT INTO clans (name) VALUES
    ('Aura 7f'),
    ('Belmonts'),
    ('Lumina'),
    ('Shadastria Adepi')
ON CONFLICT (name) DO NOTHING;
