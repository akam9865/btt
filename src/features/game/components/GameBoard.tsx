import { observer } from "mobx-react-lite";
import { styled } from "@mui/material";
import { joinPosition } from "../utils/utils";
import { useUserId } from "@/hooks/useUserId";
import { AbstractGame, TicTacToe, Cell } from "../entities/AbstractGame";

export const GameBoard = observer(({ game }: { game?: AbstractGame }) => {
  return (
    <FullBoard>
      {game &&
        game.smartBoard.map((littleBoard, bigBoardIndex) => (
          <LittleBoard
            key={bigBoardIndex}
            cells={littleBoard}
            game={game}
            isValid={game.availableBoards.includes(bigBoardIndex)}
          />
        ))}
    </FullBoard>
  );
});

// TODO: game is a passthrough variable, look for cleaner design.
const LittleBoard = observer(
  ({
    cells,
    isValid,
    game,
  }: {
    cells: TicTacToe;
    isValid: boolean;
    game: AbstractGame;
  }) => {
    if (cells.winner) {
      return <CompleteGame>{cells.winner.symbol}</CompleteGame>;
    }

    return (
      <BigCell>
        <Grid
          sx={(theme) => ({
            height: "100%",
            padding: 1,
            backgroundColor: isValid
              ? theme.palette.background.paper
              : "lightgrey",
          })}
        >
          {cells.board.map((c) => (
            <GameCell key={joinPosition(c.position)} cell={c} game={game} />
          ))}
        </Grid>
      </BigCell>
    );
  }
);

const Grid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  overflow: "hidden",
});

const FullBoard = styled(Grid)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  height: "600px",
  width: "600px",
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",

  [theme.breakpoints.down("sm")]: {
    aspectRatio: "1 / 1",
    height: "unset",
    width: "100%",
  },
}));

const GameCell = observer(
  ({ cell, game }: { cell: Cell; game: AbstractGame }) => {
    const { position } = cell;
    const userId = useUserId();

    const canClick = game.canClick(position, userId);
    const isLastMove = game.isLastMove(position);

    const handleClick = () => {
      if (!canClick) return;
      game.move(position, userId);
    };

    return (
      <LittleCell
        onClick={handleClick}
        sx={
          canClick
            ? {
                cursor: "pointer",
                ":hover": {
                  backgroundColor: (t) => t.palette.background.default,
                },
              }
            : isLastMove
            ? { backgroundColor: "#FFF6C3" }
            : {}
        }
      >
        {cell.symbol}&nbsp;
      </LittleCell>
    );
  }
);

const borderRules = {
  ":nth-of-type(3n)": {
    borderRight: "unset",
  },
  ":nth-of-type(3n - 2)": {
    borderLeft: "unset",
  },
  ":nth-of-type(-n + 3)": {
    borderTop: "unset",
  },
  ":nth-of-type(n + 7)": {
    borderBottom: "unset",
  },
};

const LittleCell = styled("div")({
  border: "1px solid",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  ...borderRules,
});

const CompleteGame = styled("div")({
  display: "flex",
  backgroundColor: "white",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "64px",
  height: "100%",
  border: "2px solid",
  ...borderRules,
});

const BigCell = styled("div")({
  border: "2px solid",
  ...borderRules,
});
