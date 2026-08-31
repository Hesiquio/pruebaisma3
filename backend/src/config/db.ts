import { Pool } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

// Pool de conexión a PostgreSQL
export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});

// Cliente opcional de Supabase SDK
export const supabase: SupabaseClient | null =
  ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (ENV.NODE_ENV === 'development') {
    console.log('[DB Query]', { text, duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
}
