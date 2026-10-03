CREATE TABLE IF NOT EXISTS domain_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE domain_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access (re-runnable)
DROP POLICY IF EXISTS "Allow public read access on domain_categories" ON domain_categories;
CREATE POLICY "Allow public read access on domain_categories" ON domain_categories FOR SELECT USING (true);

-- Allow public insert so users can add new domains (re-runnable)
DROP POLICY IF EXISTS "Allow public insert on domain_categories" ON domain_categories;
CREATE POLICY "Allow public insert on domain_categories" ON domain_categories FOR INSERT WITH CHECK (true);

-- Insert initial domains
INSERT INTO domain_categories (name) VALUES
    ('App Dev'),
    ('Web Dev'),
    ('Hardware'),
    ('AI / ML'),
    ('Cybersecurity'),
    ('Game Dev')
ON CONFLICT (name) DO NOTHING;
