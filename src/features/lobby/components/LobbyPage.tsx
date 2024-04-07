import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, styled } from "@mui/material";
import { lobbyStore } from "@/stores/games";
import { GamesList } from "./GamesList";

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
      <GamesList games={joinableGames} title={"Lobby"} />

      <CreateContainer>
        <Header>Create Game</Header>
        <ButtonsContainer>
          <Button
            variant={"outlined"}
            size={"small"}
            onClick={() => handleCreateGame("X")}
          >
            Start Game as X
          </Button>
          <Button
            variant={"outlined"}
            size={"small"}
            onClick={() => handleCreateGame("O")}
          >
            Start Game as O
          </Button>
        </ButtonsContainer>
      </CreateContainer>

      <GamesList games={games} title={"My Games"} />
    </Container>
  );
});

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 16,
}));

const CreateContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  backgroundColor: theme.palette.background.paper,
  height: "fit-content",
  width: 320,
}));

const ButtonsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: 12,
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: 8,
}));
