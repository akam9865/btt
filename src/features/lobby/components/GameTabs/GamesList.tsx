import { Avatar } from "@/features/core/ui/Profile";
import { useUserId } from "@/hooks/useUserId";
import { GameOverview, lobbyStore } from "@/stores/lobby";
import { trpc } from "@/utils/trpc";
import { styled } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const GamesList = observer(({ games }: { games: GameOverview[] }) => {
  return (
    <Container>
      {games.map((game) => (
        <GameRow game={game} key={game.gameId} />
      ))}
    </Container>
  );
});

const GameRow = observer(({ game }: { game: GameOverview }) => {
  const userId = useUserId();
  const canJoin = !game.playerX || !game.playerO;
  const mutation = trpc.joinGame.useMutation();
  const router = useRouter();
  const opponent = game.getOpponent(userId);

  const handleClick = async () => {
    if (canJoin && userId) {
      await lobbyStore.joinGame(game.gameId, userId);
      router.push(`/game/${game.gameId}`);
    } else {
      router.push(`/game/${game.gameId}`);
    }
  };

  useEffect(() => {
    if (mutation.data?.gameId) {
      router.push(`/game/${mutation.data.gameId}`);
    }
  }, [router, mutation.data?.gameId]);

  return (
    <Row onClick={handleClick}>
      <Avatar imageUrl={opponent?.image} />
      {opponent?.name}
    </Row>
  );
});

const Container = styled("div")(({ theme }) => ({
  minWidth: 320,
  background: theme.palette.background.paper,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
  flexGrow: 1,
  overflow: "auto",
  minHeight: 0,
}));

const Row = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 8,
  padding: 8,
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));
