import { gameStore } from "@/stores/game";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { GameBoard } from "./GameBoard";
import { Box, styled } from "@mui/material";
import { formatTimeSince } from "../utils/formatters";
import { Link } from "@/features/core/ui/Link";

type GameProps = { gameId: string };

export const GamePage = observer(({ gameId }: GameProps) => {
  const { createdAt, playerX, playerO, winner } = gameStore;
  useEffect(() => {
    gameStore.loadGame(gameId);
    gameStore.subscribe(gameId);
  }, [gameId]);

  return (
    <Container>
      <GameDetails>
        <Header>
          <div>Friendly Game</div>
          {formatTimeSince(createdAt)}
        </Header>
        <UserRow>
          <div>X</div>
          <Link href={`/user/${playerX?.id}`}>{playerX?.name}</Link>
        </UserRow>
        <UserRow>
          <div>O</div>
          <Link href={`/user/${playerO?.id}`}>{playerO?.name}</Link>
        </UserRow>

        {winner && <Result>{winner.symbol} Wins</Result>}
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

const Result = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: 12,
  paddingTop: 12,
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: 12,
}));

const UserRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 8,
  alignItems: "center",
}));

const Container = styled("div")(({ theme }) => ({
  gap: 24,
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const GameDetails = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  width: 240,
  flexDirection: "column",
  height: "fit-content",
  padding: 12,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
}));

const MovesList = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  height: "fit-content",
  width: 240,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
}));

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
  color: "grey",
  marginRight: 8,
  backgroundColor: theme.palette.background.default,
  padding: "4px 16px",
  width: "40px",
}));
