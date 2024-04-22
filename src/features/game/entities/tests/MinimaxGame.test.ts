import assert from "assert";
import { describe, expect, test } from "vitest";

import { Move } from "@/utils/schema/MovesSchema";
import { MinimaxGame } from "../MinimaxGame";
import { fortySixMoves } from "../../utils/ai/test/fixtures/moves";

describe("MinimaxGame", () => {
  test("new game", () => {
    const game = new MinimaxGame("123");
    expect(game.lastMove).toBeUndefined();

    expect(game.availableMoves.length).toEqual(81);
  });

  test("initializing game", () => {
    const moves: Move[] = [
      {
        position: { bigBoardIndex: 5, littleBoardIndex: 0 },
        symbol: "X",
        playerId: "hi",
      },
    ];

    const game = new MinimaxGame("123", moves);
    expect(game.lastMove).toEqual(moves[0]);

    const { availableMoves } = game;

    availableMoves.forEach((move) => {
      expect(move.bigBoardIndex).toEqual(0);
    });

    const nextMove = availableMoves.at(5);
    assert(nextMove);

    game.applyMove({ position: nextMove!, symbol: "O", playerId: "hi" });

    expect(game.lastMove).toEqual({
      position: nextMove,
      symbol: "O",
      playerId: "hi",
    });

    game.availableMoves.forEach((move) => {
      expect(move.bigBoardIndex).toEqual(5);
    });
  });

  test("weird case probably the moves are wrong", () => {
    const game = new MinimaxGame("123", fortySixMoves);
  });
});
