import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Adapter } from "next-auth/adapters";

export default NextAuth({
  callbacks: {
    session: async ({ session, user }) => {
      return { ...session, user };
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OATH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OATH_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE!,
  }) as Adapter,
  secret: "shhh",
});
