import postgres from "postgres";

export const sql = postgres(
  `postgres://postgres.${process.env.SUPABASE_ID}:${process.env.SUPABASE_PW}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
);
