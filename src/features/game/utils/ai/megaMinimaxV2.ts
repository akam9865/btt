import { Position } from "../../entities/AbstractGame";
import { MinimaxGame } from "../../entities/MinimaxGame";

interface SimulationMove {
  position?: Position;
  score: number;
}

const MAX_DEPTH = 7;

// First optimization does a rough ordering of the candidate moves before processing.
// The minimax algorithm is good at pruning when the best candidates are processed early.
// Prefer candidates that immediately win the game, then prefer candidates that minimize
// the number of moves the opponent can make.
export function megaMinimaxV2(
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

    candidates.sort((a, b) => {
      if (a.winner === "O") return -1;
      if (b.winner === "O") return 1;
      if (a.winner === "X") return 1;
      if (b.winner === "X") return -1;

      return a.availableMoves.length - b.availableMoves.length;
    });

    for (let candidateGame of candidates) {
      const newMove = megaMinimaxV2(
        candidateGame,
        depth + 1,
        false,
        alpha,
        beta
      );

      if (newMove.score > bestMove.score) {
        bestMove.score = newMove.score;
        bestMove.position = candidateGame.lastMove!.position;
      }
      alpha = Math.max(alpha, newMove.score);
      if (alpha >= beta) {
        break;
      }
    }

    return bestMove;
  } else {
    const bestMove: SimulationMove = { score: Infinity };

    const candidates = availableMoves.map(
      (position) =>
        new MinimaxGame("123", [
          ...game.moves,
          { position, symbol: "X", playerId: "" },
        ])
    );

    candidates.sort((a, b) => {
      if (a.winner === "X") return -1;
      if (b.winner === "X") return 1;
      if (a.winner === "O") return 1;
      if (b.winner === "O") return -1;

      return a.availableMoves.length - b.availableMoves.length;
    });

    for (const candidateGame of candidates) {
      const newMove = megaMinimaxV2(
        candidateGame,
        depth + 1,
        true,
        alpha,
        beta
      );

      if (newMove.score < bestMove.score) {
        bestMove.score = newMove.score;
        bestMove.position = candidateGame.lastMove!.position;
      }
      beta = Math.min(beta, newMove.score);
      if (beta <= alpha) {
        break;
      }
    }

    return bestMove;
  }
}
