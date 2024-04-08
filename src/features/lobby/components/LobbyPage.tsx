import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { styled } from "@mui/material";
import { lobbyStore } from "@/stores/lobby";
import { MatchupsTabs } from "./GameTabs/MatchupTabs";
import { GameBoard } from "@/features/game/components/GameBoard";
import { useUserId } from "@/hooks/useUserId";
import { blankGame } from "@/features/game/entities/BlankGame";

export const LobbyPage = observer(() => {
  const mutation = trpc.createGame.useMutation();

  const router = useRouter();
  const userId = useUserId();

  useEffect(() => {
    if (mutation.data?.gameId) {
      router.push(`/game/${mutation.data.gameId}`);
    }
  }, [router, mutation.data?.gameId]);

  useEffect(() => {
    if (userId) {
      lobbyStore.loadGames(userId);
    }
  }, [userId]);

  return (
    <Container>
      <GameBoard game={blankGame} />
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
  gap: 16,
  height: 600,
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
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
}));
