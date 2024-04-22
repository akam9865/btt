import { Position } from "../../entities/AbstractGame";

import { MinimaxGame } from "../../entities/MinimaxGame";

interface SimulationMove {
  position?: Position;
  score: number;
}

const MAX_DEPTH = 6;

// Keeping V1 for benchmarking
export function megaMinimax(
  game: MinimaxGame,
  depth: number,
  maximizingPlayer: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): SimulationMove {
  const { availableMoves } = game;

  if (game.isOver) {
    if (game.winner === "X") {
      return { score: depth - 10 };
    } else if (game.winner === "O") {
      return { score: 10 - depth };
    }
  }

  if (availableMoves.length === 0 || depth === MAX_DEPTH) {
    return { score: 0 };
  }

  if (maximizingPlayer) {
    const bestMove: SimulationMove = { score: -Infinity };

    const candidates = availableMoves.map(
      (position) =>
        new MinimaxGame("123", [
          ...game.moves,
          { position, symbol: "O", playerId: "" },
        ])
    );

    for (const position of availableMoves) {
      const newGame = new MinimaxGame("123", [
        ...game.moves,
        { position, symbol: "O", playerId: "" },
      ]);

      const newMove = megaMinimax(newGame, depth + 1, false, alpha, beta);

      if (newMove.score > bestMove.score) {
        bestMove.score = newMove.score;
        bestMove.position = position;
      }
      alpha = Math.max(alpha, newMove.score);
      if (alpha >= beta) {
        break;
      }
    }
    return bestMove;
  } else {
    const bestMove: SimulationMove = { score: Infinity };

    for (const position of availableMoves) {
      const newGame = new MinimaxGame("123", [
        ...game.moves,
        { position, symbol: "X", playerId: "" },
      ]);
      const newMove = megaMinimax(newGame, depth + 1, true, alpha, beta);

      if (newMove.score < bestMove.score) {
        bestMove.score = newMove.score;
        bestMove.position = position;
      }
      beta = Math.min(beta, newMove.score);
      if (beta <= alpha) {
        break;
      }
    }
    return bestMove;
  }
}
