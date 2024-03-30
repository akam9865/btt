import { gameStore } from "@/stores/game";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { GameBoard } from "./GameBoard";
import { joinPosition } from "../utils/utils";
import { styled } from "@mui/material";

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
        MOVES
        {gameStore.moves.map((m) => (
          <div key={joinPosition(m.position)}>
            {m.symbol}: {joinPosition(m.position)}
          </div>
        ))}
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
});

const MovesList = styled("div")({
  backgroundColor: "white",
  height: "fit-content",
  width: "200px",
  padding: 12,
});
