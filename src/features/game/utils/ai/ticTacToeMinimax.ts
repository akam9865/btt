export enum Player {
  Human = "X",
  Computer = "O",
}

export type Board = (Player | null)[];

interface Move {
  index?: number;
  score: number;
}

export function minimax(
  board: Board,
  depth: number,
  maximizingPlayer: boolean,
  alpha: number,
  beta: number
): Move {
  const emptyIndices = getEmptyIndices(board);

  if (checkWinner(board, Player.Computer)) {
    return { score: 10 - depth };
  } else if (checkWinner(board, Player.Human)) {
    return { score: -10 + depth };
  } else if (emptyIndices.length === 0) {
    return { score: 0 };
  }

  if (maximizingPlayer) {
    let bestMove: Move = { index: -1, score: -Infinity };
    for (const index of emptyIndices) {
      const newBoard = [...board];
      newBoard[index] = Player.Computer;
      const move = minimax(newBoard, depth + 1, false, alpha, beta);

      if (move.score > bestMove.score) {
        bestMove.index = index;
        bestMove.score = move.score;
      }
      alpha = Math.max(alpha, move.score);
      if (alpha >= beta) {
        break;
      }
    }
    return bestMove;
  } else {
    let bestMove: Move = { index: -1, score: Infinity };
    for (const index of emptyIndices) {
      const newBoard = [...board];
      newBoard[index] = Player.Human;
      const move = minimax(newBoard, depth + 1, true, alpha, beta);
      if (move.score < bestMove.score) {
        bestMove.index = index;
        bestMove.score = move.score;
      }
      beta = Math.min(beta, move.score);
      if (beta <= alpha) {
        break;
      }
    }
    return bestMove;
  }
}

function getEmptyIndices(board: Board): number[] {
  const emptyIndices: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      emptyIndices.push(i);
    }
  }
  return emptyIndices;
}

function checkWinner(board: Board, player: Player): boolean {
  const winConditions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (const condition of winConditions) {
    if (condition.every((index) => board[index] === player)) {
      return true;
    }
  }
  return false;
}

export function printBoard(board: Board) {
  const rows = [];
  for (let i = 0; i < 9; i += 3) {
    rows.push(
      board
        .slice(i, i + 3)
        .map((cell) => cell ?? " ")
        .join(" | ")
    );
  }
  console.log(rows.join("\n---------\n"));
}
