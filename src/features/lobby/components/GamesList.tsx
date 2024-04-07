import { GameOverview } from "@/stores/games";
import { trpc } from "@/utils/trpc";
import { Button, styled } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const GamesList = observer(
  ({ title, games }: { title: string; games: GameOverview[] }) => {
    const { data } = useSession();
    const user = data?.user as { id: string } | undefined;
    const mutation = trpc.joinGame.useMutation();
    const router = useRouter();

    const handleJoinGame = (gameId: string, symbol: string = "X") => {
      if (!user?.id) return;
      mutation.mutate({ playerId: user.id, gameId, symbol });
    };

    useEffect(() => {
      if (mutation.data?.gameId) {
        router.push(`/game/${mutation.data.gameId}`);
      }
    }, [router, mutation.data?.gameId]);

    return (
      <Container>
        <Header>{title}</Header>

        {games.map((game) => (
          <Row key={game.gameId}>
            {game.playerX ? (
              <div>{game.playerX.name}</div>
            ) : (
              <Button
                variant={"outlined"}
                size={"small"}
                onClick={() => handleJoinGame("X")}
              >
                Join
              </Button>
            )}
            {game.playerO ? (
              <div>{game.playerO.name}</div>
            ) : (
              <Button
                variant={"outlined"}
                size={"small"}
                onClick={() => handleJoinGame("O")}
              >
                Join
              </Button>
            )}
          </Row>
        ))}
      </Container>
    );
  }
);

const Container = styled("div")(({ theme }) => ({
  minWidth: 320,
  background: theme.palette.background.paper,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: 8,
}));

const Row = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: 8,
  alignItems: "center",
}));
