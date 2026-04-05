const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.veahocvrozunjsicvvie:mankutuber88@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'contacts_insert' AND tablename = 'contacts') THEN
    CREATE POLICY contacts_insert ON contacts FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'contacts_select' AND tablename = 'contacts') THEN
    CREATE POLICY contacts_select ON contacts FOR SELECT USING (true);
  END IF;
END $$;
`;

pool.query(sql)
  .then(() => { console.log('Contacts table created!'); pool.end(); })
  .catch(e => { console.error('Error:', e.message); pool.end(); });
