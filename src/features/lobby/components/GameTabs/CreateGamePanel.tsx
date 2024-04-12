import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Button, styled } from "@mui/material";
import { useUserId } from "@/hooks/useUserId";
import Link from "next/link";

export const CreateGamePanel = observer(() => {
  const mutation = trpc.createGame.useMutation();
  const router = useRouter();
  const userId = useUserId();

  const handleCreateGame = (symbol: string = "X") => {
    if (!userId) return;
    mutation.mutate({ playerId: userId, symbol });
  };

  useEffect(() => {
    if (mutation.data?.gameId) {
      router.push(`/game/${mutation.data.gameId}`);
    }
  }, [router, mutation.data?.gameId]);

  return (
    <CreateContainer>
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
        <Link href="/game/local">
          <Button variant={"outlined"} size={"small"}>
            Start Local Game
          </Button>
        </Link>
      </ButtonsContainer>
    </CreateContainer>
  );
});

const CreateContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  justifyContent: "center",
  padding: 12,
}));

const ButtonsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: 12,
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: 8,
}));
