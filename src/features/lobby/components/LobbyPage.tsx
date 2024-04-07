import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Box, Button, styled } from "@mui/material";
import { GameOverview, lobbyStore } from "@/stores/games";

export const LobbyPage = observer(() => {
  const mutation = trpc.createGame.useMutation();
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as { id: string } | undefined;

  const { games } = lobbyStore;

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
    <div>
      {/* MyGames - get list of games I'm involved in and can join */}
      <GamesContainer>
        <Box sx={{ background: "lightgrey", px: 1.5, py: 1 }}>
          Joinable Games
        </Box>
        {games.map((game) => (
          <GameComp game={game} key={game.gameId} />
        ))}
        {/* <GameComp game={{ playerX: null, playerO: null, gameId: "1" }} /> */}
        <GameRow>
          <PlayerOrButton>
            <Button
              variant={"outlined"}
              size={"small"}
              onClick={() => handleCreateGame("X")}
            >
              Create Game as X
            </Button>
          </PlayerOrButton>

          <PlayerOrButton>
            <Button
              variant={"outlined"}
              size={"small"}
              onClick={() => handleCreateGame("O")}
            >
              Create Game as O
            </Button>
          </PlayerOrButton>
        </GameRow>
      </GamesContainer>
      {/* <Button onClick={handleCreateGame} variant="outlined">
        Find a Game
      </Button> */}
    </div>
  );
});

const GameComp = observer(({ game }: { game: GameOverview }) => {
  return (
    <GameRow>
      <PlayerOrButton>
        {game.playerX ? (
          game.playerX.name
        ) : (
          <Button variant={"outlined"} size={"small"}>
            Join
          </Button>
        )}
      </PlayerOrButton>

      <PlayerOrButton>
        {game.playerO ? (
          game.playerO.name
        ) : (
          <Button variant={"outlined"} size={"small"}>
            Join
          </Button>
        )}
      </PlayerOrButton>
    </GameRow>
  );
});

const PlayerOrButton = styled("div")(({ theme }) => ({}));

const GameRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 400,
  height: 44,
  padding: "6px 12px",
}));

const GamesContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  // padding: 12,
}));
