import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// supabase client for subscribing to updates
// we can connect to the db directly from trpc methods
export const supabase = createClient(supabaseUrl, supabaseKey);
