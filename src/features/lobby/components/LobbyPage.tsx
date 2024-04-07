import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { styled } from "@mui/material";
import { lobbyStore } from "@/stores/games";
import { GamesList } from "./GameTabs/GamesList";
import { MatchupsTabs } from "./GameTabs/MatchupTabs";

export const LobbyPage = observer(() => {
  const mutation = trpc.createGame.useMutation();

  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as { id: string } | undefined;

  const { games, joinableGames } = lobbyStore;

  const handleCreateGame = (symbol: string = "X") => {
    if (!user?.id) return;
    mutation.mutate({ playerId: user.id, symbol });
  };

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
      {/* <GamesList games={joinableGames} title={"Lobby"} />
      <GamesList games={games} title={"My Games"} /> */}
      <MatchupsTabs />
    </Container>
  );
});

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 16,
}));
