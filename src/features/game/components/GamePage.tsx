import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { GameBoard } from "./GameBoard";
import { Box, styled } from "@mui/material";
import { formatTimeSince } from "../utils/formatters";
import { Link } from "@/features/core/ui/Link";
import { gamesStore } from "@/stores/games";

type GameProps = { gameId: string };

export const GamePage = observer(({ gameId }: GameProps) => {
  const game = gamesStore.getGame(gameId);
  const { createdAt, playerX, playerO, winner, formattedMoves } = game || {};

  useEffect(() => {
    gamesStore.loadGame(gameId);
  }, [gameId]);

  return (
    <Container>
      <GameBoard game={game} />
      <SidePanel>
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

          {winner && <Result>{winner} Wins</Result>}
        </GameDetails>

        <MovesList>
          {formattedMoves?.map(({ moves, turnNumber }) => {
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
      </SidePanel>
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
    height: 600,
    flexDirection: "row",
  },
}));

const GameDetails = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
  padding: 12,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
}));

const MovesList = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
  minHeight: 0,
  overflow: "auto",

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
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

const SidePanel = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: 350,

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));
