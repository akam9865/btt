import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { styled } from "@mui/material";
import { lobbyStore } from "@/stores/games";
import { MatchupsTabs } from "./GameTabs/MatchupTabs";
import { GameBoard } from "@/features/game/components/GameBoard";

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
      <GameBoard />
      <SidePanel>
        <MatchupsTabs />
        <Rules>
          <ul>
            <li>Win the small board to claim it for your side</li>
            <li>
              The next move may only be played in the board that corresponds
              with the cell where the last move was played. i.e. last move was
              in the top right cell of a board, the next move must be on the top
              right board.
            </li>
            <li>
              If the corresponding board is already complete, then any board may
              be played.
            </li>
            <li>Win three in a row on a large board to win the game.</li>
          </ul>
        </Rules>
      </SidePanel>
    </Container>
  );
});

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  gap: 16,
}));

const SidePanel = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

const Rules = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingRight: 12,
  width: 350,
}));
