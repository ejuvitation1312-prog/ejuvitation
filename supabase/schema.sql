-- ═══════════════════════════════════════════════════════════════
-- SQL SCHEMA UNTUK SUPABASE WEDDING INVITATION (ELIA & JUAN)
-- Jalankan skrip ini di SQL Editor di Supabase Dashboard
-- ═══════════════════════════════════════════════════════════════

-- 1. Table settings (menyimpan konfigurasi dinamis undangan)
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table guests (daftar tamu undangan & status pengiriman WA)
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    status TEXT DEFAULT 'Belum Dikirim',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pencarian tamu
CREATE INDEX IF NOT EXISTS idx_guests_name ON public.guests (name);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON public.guests (created_at);

-- 3. Table wishes (ucapan doa & konfirmasi kehadiran RSVP)
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    attendance TEXT DEFAULT 'Hadir',
    guests INTEGER DEFAULT 1,
    message TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index ucapan
CREATE INDEX IF NOT EXISTS idx_wishes_name ON public.wishes (name);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes (created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- settings: publik bisa baca (anon & authenticated), service role bisa edit
DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
CREATE POLICY "Allow public read settings" ON public.settings
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow service role all settings" ON public.settings;
CREATE POLICY "Allow service role all settings" ON public.settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- guests: publik bisa validasi nama tamu
DROP POLICY IF EXISTS "Allow public read guests" ON public.guests;
CREATE POLICY "Allow public read guests" ON public.guests
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow service role all guests" ON public.guests;
CREATE POLICY "Allow service role all guests" ON public.guests
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- wishes: publik bisa baca dan kirim ucapan
DROP POLICY IF EXISTS "Allow public read wishes" ON public.wishes;
CREATE POLICY "Allow public read wishes" ON public.wishes
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert wishes" ON public.wishes;
CREATE POLICY "Allow public insert wishes" ON public.wishes
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update own wish" ON public.wishes;
CREATE POLICY "Allow public update own wish" ON public.wishes
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role all wishes" ON public.wishes;
CREATE POLICY "Allow service role all wishes" ON public.wishes
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6. Storage Bucket 'wedding-assets' untuk foto & musik undangan
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-assets', 'wedding-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read wedding-assets" ON storage.objects;
CREATE POLICY "Allow public read wedding-assets" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'wedding-assets');

DROP POLICY IF EXISTS "Allow service role all wedding-assets" ON storage.objects;
CREATE POLICY "Allow service role all wedding-assets" ON storage.objects
    FOR ALL TO service_role USING (bucket_id = 'wedding-assets') WITH CHECK (bucket_id = 'wedding-assets');
