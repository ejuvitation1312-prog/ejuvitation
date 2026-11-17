import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://dummy-wedding-project.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-key-for-build";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || supabaseServiceKey;

export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.SUPABASE_URL &&
    !process.env.SUPABASE_URL.includes("dummy-wedding-project") &&
    !process.env.SUPABASE_URL.includes("xxxx") &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("dummy")
  );
};

// Use service_role key for server-side operations (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
  },
});

// For client-side (anon key, respects RLS)
export const supabaseAnon = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
    },
  }
);
