import { describe, expect, test } from "vitest";

import { MinimaxGame } from "@/features/game/entities/MinimaxGame";
import { megaMinimaxV2 } from "../megaMinimaxV2";
import { firstBoardOBlocks, xClearWin } from "./fixtures/moves";

describe("mega minmax", () => {
  test("X should hit the depth limit on an open board", () => {
    const game = new MinimaxGame("123");
    const move = megaMinimaxV2(game, 0, false);

    expect(move.score).toEqual(0);
  });

  test("O should hit the depth limit on an open board", () => {
    const game = new MinimaxGame("123", [
      {
        position: { bigBoardIndex: 5, littleBoardIndex: 5 },
        symbol: "X",
        playerId: "hi",
      },
    ]);
    const move = megaMinimaxV2(game, 0, true);

    expect(move.score).toEqual(0);
  });

  test("X should pick an immediate win", () => {
    const game = new MinimaxGame("123", xClearWin);
    const bestMove = megaMinimaxV2(game, 0, false);

    expect(bestMove.position).toEqual({
      bigBoardIndex: 0,
      littleBoardIndex: 8,
    });
  });

  test("O should skip a cell if it would result in an immediate X win", () => {
    const game = new MinimaxGame("123", firstBoardOBlocks);
    const bestMove = megaMinimaxV2(game, 0, true);

    expect(bestMove.position).not.toEqual({
      bigBoardIndex: 0,
      littleBoardIndex: 0,
    });
  });
});
