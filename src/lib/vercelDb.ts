// Vercel Database & Storage Integration Library
// Supports Vercel Postgres (Serverless PostgreSQL) & Vercel KV (Serverless Redis REST)

export interface VercelDbCredentials {
  postgresUrl: string;
  kvUrl: string;
  kvToken: string;
}

export function getVercelDbCredentials(): VercelDbCredentials {
  const storedPostgres = localStorage.getItem('lbh_vercel_postgres_url') || '';
  const storedKvUrl = localStorage.getItem('lbh_vercel_kv_url') || '';
  const storedKvToken = localStorage.getItem('lbh_vercel_kv_token') || '';

  const envPostgres = (import.meta as any).env?.VITE_POSTGRES_URL || (import.meta as any).env?.POSTGRES_URL || '';
  const envKvUrl = (import.meta as any).env?.VITE_KV_REST_API_URL || (import.meta as any).env?.KV_REST_API_URL || '';
  const envKvToken = (import.meta as any).env?.VITE_KV_REST_API_TOKEN || (import.meta as any).env?.KV_REST_API_TOKEN || '';

  return {
    postgresUrl: (storedPostgres || envPostgres).trim(),
    kvUrl: (storedKvUrl || envKvUrl).trim(),
    kvToken: (storedKvToken || envKvToken).trim(),
  };
}

export function isVercelDbConfigured(): boolean {
  const { postgresUrl, kvUrl, kvToken } = getVercelDbCredentials();
  return Boolean(
    (postgresUrl && (postgresUrl.startsWith('postgres://') || postgresUrl.startsWith('postgresql://'))) ||
    (kvUrl && kvToken && kvUrl.startsWith('http'))
  );
}

/**
 * Test connection to Vercel Database (Vercel KV REST or Vercel Postgres)
 */
export async function testVercelConnection(
  postgresUrl: string, 
  kvUrl: string, 
  kvToken: string
): Promise<{ success: boolean; message: string; type: 'kv' | 'postgres' | 'none' }> {
  try {
    // 1. Test Vercel KV REST API if provided
    if (kvUrl && kvToken) {
      if (!kvUrl.startsWith('http')) {
        return { success: false, message: 'URL Vercel KV harus diawali dengan https://', type: 'kv' };
      }

      const res = await fetch(`${kvUrl.replace(/\/$/, '')}/ping`, {
        headers: {
          Authorization: `Bearer ${kvToken}`,
        },
      });

      if (!res.ok) {
        // Try fallback GET command
        const testRes = await fetch(`${kvUrl.replace(/\/$/, '')}/get/lbh_status`, {
          headers: { Authorization: `Bearer ${kvToken}` }
        });
        if (!testRes.ok) {
          return { 
            success: false, 
            message: `Koneksi ke Vercel KV gagal (Status ${res.status}). Pastikan KV_REST_API_URL dan KV_REST_API_TOKEN benar.`, 
            type: 'kv' 
          };
        }
      }

      return {
        success: true,
        message: 'Koneksi ke Vercel KV (Redis) berhasil! Data website LBH Ansor Banten tersinkronisasi online 24 jam.',
        type: 'kv',
      };
    }

    // 2. Test Vercel Postgres via backend API
    if (postgresUrl) {
      if (!postgresUrl.startsWith('postgres://') && !postgresUrl.startsWith('postgresql://')) {
        return { 
          success: false, 
          message: 'URL Vercel Postgres harus diawali dengan postgres:// atau postgresql://', 
          type: 'postgres' 
        };
      }

      const res = await fetch('/api/vercel/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postgresUrl }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return {
          success: true,
          message: 'Koneksi ke Vercel Postgres berhasil! Tabel database siap melayani pencatatan perkara.',
          type: 'postgres',
        };
      } else {
        return {
          success: data.success || false,
          message: data.message || 'Koneksi ke Vercel Postgres berhasil divalidasi. Pastikan tabel telah dibuat di Vercel SQL Query Console.',
          type: 'postgres',
        };
      }
    }

    return {
      success: false,
      message: 'Masukkan URL Vercel Postgres atau Vercel KV credentials untuk memulai pengujian.',
      type: 'none',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menguji koneksi Vercel: ${err?.message || 'Kesalahan jaringan'}`,
      type: 'none',
    };
  }
}

/**
 * Save data to Vercel KV via REST API
 */
export async function saveToVercelKv(key: string, value: any): Promise<boolean> {
  const { kvUrl, kvToken } = getVercelDbCredentials();
  if (!kvUrl || !kvToken) return false;

  try {
    const cleanUrl = kvUrl.replace(/\/$/, '');
    const res = await fetch(`${cleanUrl}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
    return res.ok;
  } catch (err) {
    console.warn(`Vercel KV save failed for key ${key}:`, err);
    return false;
  }
}

/**
 * Load data from Vercel KV via REST API
 */
export async function loadFromVercelKv<T>(key: string): Promise<T | null> {
  const { kvUrl, kvToken } = getVercelDbCredentials();
  if (!kvUrl || !kvToken) return null;

  try {
    const cleanUrl = kvUrl.replace(/\/$/, '');
    const res = await fetch(`${cleanUrl}/get/${encodeURIComponent(key)}`, {
      headers: {
        Authorization: `Bearer ${kvToken}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.result !== undefined && data.result !== null) {
      if (typeof data.result === 'string') {
        try {
          return JSON.parse(data.result) as T;
        } catch {
          return data.result as unknown as T;
        }
      }
      return data.result as T;
    }
    return null;
  } catch (err) {
    console.warn(`Vercel KV load failed for key ${key}:`, err);
    return null;
  }
}

/**
 * Returns SQL Schema script ready to paste in Vercel Postgres SQL Query Console
 * (Dashboard > Storage > Postgres > Query)
 */
export function getVercelPostgresSqlSchema(): string {
  return `-- ========================================================
-- SKEMA DATABASE VERCEL POSTGRES (SERVERLESS NEON / VERCEL)
-- LEMBAGA BANTUAN HUKUM GP ANSOR PROVINSI BANTEN
-- Eksekusi kode ini di Vercel Dashboard > Storage > Postgres > Query
-- ========================================================

-- 1. Tabel Pengaturan Website & Identitas Lembaga (Site Settings)
CREATE TABLE IF NOT EXISTS lbh_site_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default_settings',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Tabel Kasus & Konsultasi Hukum Online (Cases)
CREATE TABLE IF NOT EXISTS lbh_cases (
  id VARCHAR(100) PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  client_email VARCHAR(255),
  id_card_number VARCHAR(50),
  regency VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  case_title VARCHAR(255) NOT NULL,
  chronology TEXT NOT NULL,
  evidence_url TEXT,
  evidence_file_name VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'verifikasi',
  status_notes TEXT,
  assigned_lawyer_id VARCHAR(100),
  assigned_lawyer_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index pencarian nomor tiket dan status perkara
CREATE INDEX IF NOT EXISTS idx_lbh_cases_ticket ON lbh_cases(ticket_number);
CREATE INDEX IF NOT EXISTS idx_lbh_cases_status ON lbh_cases(status);
CREATE INDEX IF NOT EXISTS idx_lbh_cases_regency ON lbh_cases(regency);

-- 3. Tabel Artikel, Berita & Edukasi Hukum (Articles)
CREATE TABLE IF NOT EXISTS lbh_articles (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author VARCHAR(255) NOT NULL,
  author_role VARCHAR(255),
  published_at DATE NOT NULL,
  read_time_minutes INT DEFAULT 5,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Tabel Direktori Advokat & Struktur Organisasi (Lawyers)
CREATE TABLE IF NOT EXISTS lbh_lawyers (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(50),
  role VARCHAR(255) NOT NULL,
  regency VARCHAR(100) NOT NULL,
  specialization TEXT[],
  photo_url TEXT,
  experience_years INT DEFAULT 5,
  bar_number VARCHAR(100),
  is_available BOOLEAN DEFAULT TRUE,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Tabel Posko Bantuan Hukum 8 Kabupaten / Kota se-Banten (Branches)
CREATE TABLE IF NOT EXISTS lbh_branches (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  regency VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  operational_hours VARCHAR(100),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  google_maps_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Konfirmasi pembuatan tabel berhasil
SELECT 'Database Vercel Postgres LBH GP Ansor Banten berhasil diinisialisasi!' AS status;
`;
}
