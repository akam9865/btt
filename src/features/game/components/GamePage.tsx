import { gameStore } from "@/stores/game";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { GameBoard } from "./GameBoard";
import { joinPosition } from "../utils/utils";
import { Box, styled } from "@mui/material";

type GameProps = { gameId: string };

export const GamePage = observer(({ gameId }: GameProps) => {
  useEffect(() => {
    gameStore.loadGame(gameId);
    gameStore.subscribe(gameId);
  }, [gameId]);

  return (
    <Container>
      <GameDetails>
        X: {gameStore.playerX}
        <br />
        O: {gameStore.playerO}
      </GameDetails>

      <GameBoard />

      <MovesList>
        {gameStore.formattedMoves.map(({ moves, turnNumber }) => {
          return (
            <MoveRow key={turnNumber}>
              <MoveNumber>{turnNumber}</MoveNumber>
              <MovePair>
                <Box flex={1}>X ({moves.x})</Box>
                {moves.o && <Box flex={1}>O ({moves.o})</Box>}
              </MovePair>
            </MoveRow>
          );
        })}
      </MovesList>
    </Container>
  );
});

const Container = styled("div")(({ theme }) => ({
  gap: 24,
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const GameDetails = styled("div")({
  display: "flex",
  backgroundColor: "white",
  height: "120px",
  padding: 12,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
});

const MovesList = styled("div")({
  backgroundColor: "white",
  height: "fit-content",
  width: "200px",
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
});

const MoveRow = styled("div")({
  display: "flex",
  alignContent: "center",
  alignItems: "center",
});

const MovePair = styled("div")({
  display: "flex",
  flex: 1,
});

const MoveNumber = styled("div")(({ theme }) => ({
  fontWeight: "bold",
  marginRight: 8,
  background: "lightgrey",
  padding: "4px 16px",
  width: "40px",
}));
