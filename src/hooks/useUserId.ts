import { useSession } from "next-auth/react";

export function useUserId(): string | undefined {
  const { data } = useSession();
  const user = data?.user as { id: string } | undefined;
  return user?.id;
}
