import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, styled } from "@mui/material";

export const CreateGamePanel = observer(() => {
  const mutation = trpc.createGame.useMutation();

  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as { id: string } | undefined;

  const handleCreateGame = (symbol: string = "X") => {
    if (!user?.id) return;
    mutation.mutate({ playerId: user.id, symbol });
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
      </ButtonsContainer>
    </CreateContainer>
  );
});

const CreateContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  backgroundColor: theme.palette.background.paper,
  height: "fit-content",
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
