import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Table names
export const SUPABASE_TABLES = {
  CASES: 'lbh_cases',
  ARTICLES: 'lbh_articles',
  LAWYERS: 'lbh_lawyers',
  BRANCHES: 'lbh_branches',
  SETTINGS: 'lbh_site_settings',
};

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

export function getSupabaseCredentials(): { url: string; key: string } {
  // Check localStorage first (from admin settings), then fallback to Vite env vars
  const storedUrl = localStorage.getItem('lbh_supabase_url');
  const storedKey = localStorage.getItem('lbh_supabase_anon_key');

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const url = (storedUrl || envUrl || '').trim();
  const key = (storedKey || envKey || '').trim();

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || !url.startsWith('http')) {
    return null;
  }

  const currentConfigKey = `${url}::${key}`;
  if (cachedClient && cachedConfigKey === currentConfigKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    cachedConfigKey = currentConfigKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to instantiate Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!url || !key) {
      return { success: false, message: 'URL Proyek dan Anon Key tidak boleh kosong.' };
    }
    const client = createClient(url, key);
    const { error } = await client.from(SUPABASE_TABLES.SETTINGS).select('count', { count: 'exact', head: true });
    
    if (error && error.code !== 'PGRST116' && !error.message.includes('does not exist')) {
      return { success: false, message: `Koneksi gagal: ${error.message}` };
    }

    return { 
      success: true, 
      message: 'Koneksi ke Supabase berhasil! Database siap digunakan untuk sinkronisasi live di Vercel.' 
    };
  } catch (err: any) {
    return { success: false, message: `Koneksi gagal: ${err.message || 'Kesalahan jaringan'}` };
  }
}

/**
 * Returns SQL Schema script ready to paste in Supabase SQL Editor
 */
export function getSupabaseSqlSchema(): string {
  return `-- ==========================================
-- SKEMA DATABASE LBH GP ANSOR PROVINSI BANTEN
-- Eksekusi kode ini di Supabase SQL Editor
-- ==========================================

-- 1. Tabel Pengaturan Situs (Site Settings)
CREATE TABLE IF NOT EXISTS lbh_site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Kasus & Konsultasi Online (Cases)
CREATE TABLE IF NOT EXISTS lbh_cases (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  id_card_number TEXT,
  regency TEXT NOT NULL,
  category TEXT NOT NULL,
  case_title TEXT NOT NULL,
  chronology TEXT NOT NULL,
  evidence_url TEXT,
  evidence_file_name TEXT,
  status TEXT NOT NULL DEFAULT 'verifikasi',
  status_notes TEXT,
  assigned_lawyer_id TEXT,
  assigned_lawyer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Artikel & Berita Hukum (Articles)
CREATE TABLE IF NOT EXISTS lbh_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  author_role TEXT,
  published_at DATE NOT NULL,
  read_time_minutes INT DEFAULT 5,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Direktori Advokat & Paralegal (Lawyers)
CREATE TABLE IF NOT EXISTS lbh_lawyers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  role TEXT NOT NULL,
  regency TEXT NOT NULL,
  specialization TEXT[],
  photo_url TEXT,
  experience_years INT DEFAULT 5,
  bar_number TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Posko Bantuan Hukum Cabang se-Banten (Branches)
CREATE TABLE IF NOT EXISTS lbh_branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  regency TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  operational_hours TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  google_maps_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS) & IZIN AKSES PUBLIK
ALTER TABLE lbh_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lbh_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lbh_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lbh_lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lbh_branches ENABLE ROW LEVEL SECURITY;

-- Kebijakan akses anonim (untuk kemudahan applet LBH Ansor Banten)
DROP POLICY IF EXISTS "Public can read settings" ON lbh_site_settings;
CREATE POLICY "Public can read settings" ON lbh_site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can update settings" ON lbh_site_settings;
CREATE POLICY "Public can update settings" ON lbh_site_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can insert cases" ON lbh_cases;
CREATE POLICY "Public can insert cases" ON lbh_cases FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can view cases" ON lbh_cases;
CREATE POLICY "Public can view cases" ON lbh_cases FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can update cases" ON lbh_cases;
CREATE POLICY "Admin can update cases" ON lbh_cases FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can read articles" ON lbh_articles;
CREATE POLICY "Public can read articles" ON lbh_articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can manage articles" ON lbh_articles;
CREATE POLICY "Admin can manage articles" ON lbh_articles FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can read lawyers" ON lbh_lawyers;
CREATE POLICY "Public can read lawyers" ON lbh_lawyers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can manage lawyers" ON lbh_lawyers;
CREATE POLICY "Admin can manage lawyers" ON lbh_lawyers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can read branches" ON lbh_branches;
CREATE POLICY "Public can read branches" ON lbh_branches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can manage branches" ON lbh_branches;
CREATE POLICY "Admin can manage branches" ON lbh_branches FOR ALL USING (true);
`;
}
