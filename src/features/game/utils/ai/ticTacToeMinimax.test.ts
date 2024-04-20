import { describe, expect, test } from "vitest";
import { Board, Player, minimax } from "./ticTacToeMinimax";

describe("minmax", () => {
  test("X simple win", () => {
    const initialBoard: Board = [
      Player.Human,
      null,
      null,
      Player.Computer,
      Player.Human,
      null,
      null,
      Player.Computer,
      null,
    ];

    const move = minimax(initialBoard, 0, false, -Infinity, Infinity);
    initialBoard[move.index!] = Player.Human;

    expect(move.index).toBe(8);
  });

  test("X forking win", () => {
    const initialBoard: Board = [
      Player.Human,
      null,
      Player.Computer,
      null,
      Player.Computer,
      null,
      null,
      null,
      Player.Human,
    ];

    const move = minimax(initialBoard, 0, false, -Infinity, Infinity);
    initialBoard[move.index!] = Player.Human;

    expect(move.index).toBe(6);
  });

  test("O simple win", () => {
    const initialBoard: Board = [
      Player.Human,
      Player.Human,
      Player.Computer,
      null,
      Player.Computer,
      null,
      null,
      null,
      Player.Human,
    ];

    const move = minimax(initialBoard, 0, true, -Infinity, Infinity);
    initialBoard[move.index!] = Player.Computer;

    expect(move.index).toBe(6);
  });
});
