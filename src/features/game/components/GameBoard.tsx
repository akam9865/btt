import { Cell, gameStore, TicTacToe } from "@/stores/game";
import { sessionStore } from "@/stores/session";
import { observer } from "mobx-react-lite";

import { styled } from "@mui/material";
import { joinPosition } from "../utils/utils";

export const GameBoard = observer(() => {
  const { smartBoard, availableBoards } = gameStore;

  return (
    <FullBoard>
      {smartBoard.map((littleBoard, bigBoardIndex) => (
        <LittleBoard
          key={bigBoardIndex}
          cells={littleBoard}
          isValid={availableBoards.includes(bigBoardIndex)}
        />
      ))}
    </FullBoard>
  );
});

const LittleBoard = observer(
  ({ cells, isValid }: { cells: TicTacToe; isValid: boolean }) => {
    if (cells.winner) {
      return <CompleteGame>{cells.winner.symbol}</CompleteGame>;
    }

    return (
      <BigCell>
        <Grid
          sx={{
            height: "100%",
            padding: 1,
            backgroundColor: isValid ? "white" : "grey",
          }}
        >
          {cells.board.map((c) => (
            <GameCell key={joinPosition(c.position)} cell={c} />
          ))}
        </Grid>
      </BigCell>
    );
  }
);

const Grid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
});

const FullBoard = styled(Grid)(({ theme }) => ({
  height: "600px",
  width: "600px",

  [theme.breakpoints.down("sm")]: {
    aspectRatio: "1 / 1",
    height: "unset",
    width: "100%",
  },
}));

const GameCell = observer(({ cell }: { cell: Cell }) => {
  const { position } = cell;
  const { uuid: playerId } = sessionStore;
  const canClick = gameStore.canClick(position, playerId);

  const handleClick = () => {
    if (!canClick) return;

    gameStore.move(playerId, position);
  };

  return (
    <LittleCell
      onClick={handleClick}
      sx={
        canClick
          ? {
              cursor: "pointer",
              ":hover": {
                backgroundColor: "lightgrey",
              },
            }
          : undefined
      }
    >
      {cell.symbol}&nbsp;
    </LittleCell>
  );
});

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
