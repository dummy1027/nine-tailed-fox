-- Create items table
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT (public read)
CREATE POLICY "Enable SELECT access for all users" ON items
  FOR SELECT USING (TRUE);

-- Create policy for INSERT
CREATE POLICY "Enable INSERT access for authenticated users" ON items
  FOR INSERT WITH CHECK (TRUE);

-- Create policy for UPDATE
CREATE POLICY "Enable UPDATE access for authenticated users" ON items
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Create policy for DELETE
CREATE POLICY "Enable DELETE access for authenticated users" ON items
  FOR DELETE USING (TRUE);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
