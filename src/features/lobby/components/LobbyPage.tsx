import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { styled } from "@mui/material";
import { lobbyStore } from "@/stores/games";
import { MatchupsTabs } from "./GameTabs/MatchupTabs";

export const LobbyPage = observer(() => {
  const mutation = trpc.createGame.useMutation();

  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as { id: string } | undefined;

  useEffect(() => {
    if (mutation.data?.gameId) {
      router.push(`/game/${mutation.data.gameId}`);
    }
  }, [router, mutation.data?.gameId]);

  useEffect(() => {
    if (user) {
      lobbyStore.loadGames(user.id);
    }
  }, [user]);

  return (
    <Container>
      <MatchupsTabs />
    </Container>
  );
});

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 16,
}));
