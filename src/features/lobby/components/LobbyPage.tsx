import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Box, styled } from "@mui/material";
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
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <GameBoard game={blankGame} />
      </Box>
      <SidePanel>
        <MatchupsTabs />
        <Rules>
          <ul>
            <li>Win a small board to claim it for your side</li>
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
            <li>Win three in a row on the large board to win the game.</li>
          </ul>
        </Rules>
      </SidePanel>
    </Container>
  );
});

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 16,

  [theme.breakpoints.up("xs")]: {
    flexDirection: "column",
  },

  [theme.breakpoints.up("sm")]: {
    maxWidth: 600,
    margin: "auto",
  },

  [theme.breakpoints.up("md")]: {
    maxWidth: "unset",
    flexDirection: "row",
  },
}));

const SidePanel = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: 350,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const Rules = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingRight: 12,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
}));
