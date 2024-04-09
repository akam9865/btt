import { joinPosition } from "@/features/game/utils/utils";
import { type Move } from "@/utils/schema/MovesSchema";
import { action, computed, makeObservable, observable } from "mobx";

// A board will be a 1d array with 9 elements.
// Indices translate to a 3x3 grid as follows:
// 0 1 2
// 3 4 5
// 6 7 8
export const BOARD_INDICES: PositionIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Position = Move["position"];

export type BigBoard = [
  TicTacToe,
  TicTacToe,
  TicTacToe,
  TicTacToe,
  TicTacToe,
  TicTacToe,
  TicTacToe,
  TicTacToe,
  TicTacToe
];

export abstract class AbstractGame {
  createdAt?: Date;
  moves: Move[] = [];
  smartBoard: BigBoard;
  playerXId: string | null = null;
  playerOId: string | null = null;

  constructor(public gameId: string) {
    this.smartBoard = BOARD_INDICES.map(
      (bigBoardIndex) => new TicTacToe(bigBoardIndex)
    ) as BigBoard;

    makeObservable(this, {
      playerXId: observable,
      playerOId: observable,
      moves: observable,
      smartBoard: observable,
      playerX: computed,
      playerO: computed,
      lastMove: computed,
      availableBoards: computed,
      formattedMoves: computed,
      turnSymbol: computed,
      turnPlayerId: computed,
      applyMove: action,
    });
  }

  get turnSymbol(): "X" | "O" {
    return this.moves.length % 2 === 0 ? "X" : "O";
  }

  get turnPlayerId(): string | null {
    return this.turnSymbol === "X" ? this.playerXId : this.playerOId;
  }

  get lastMove(): Move | undefined {
    return this.moves.at(-1);
  }

  get availableBoards(): number[] {
    const { lastMove } = this;
    const allContestedBoards = BOARD_INDICES.filter(
      (boardIndex) => !this.smartBoard[boardIndex].isOver
    );

    if (!lastMove) {
      return allContestedBoards;
    }

    const { littleBoardIndex } = lastMove.position;
    if (this.smartBoard[littleBoardIndex].isOver) {
      return allContestedBoards;
    }

    return [littleBoardIndex];
  }

  get winner() {
    const boardResults = this.smartBoard.map(
      (board) => board.winner?.symbol || null
    );
    return getWinnerForBoard(boardResults)?.symbol;
  }

  get isOver(): Boolean {
    return (
      Boolean(this.winner) || this.smartBoard.every((board) => board.isOver)
    );
  }

  get formattedMoves() {
    const formattedMoves = [];
    const i = 0;
    for (let i = 0; i < this.moves.length; i += 2) {
      const [xMove, oMove] = this.moves.slice(i, i + 2);
      const turnNumber = Math.floor(i / 2) + 1;
      const x = joinPosition(xMove.position);
      const o = oMove ? joinPosition(oMove.position) : undefined;
      formattedMoves.push({ moves: { x, o }, turnNumber });
    }
    return formattedMoves;
  }

  canClick(position: Position, playerId?: string) {
    if (!playerId) return false;
    if (this.winner) return false;

    const board = this.smartBoard[position.bigBoardIndex];

    if (board.board[position.littleBoardIndex].symbol) return false;
    if (board.isOver) return false;
    if (playerId !== this.turnPlayerId) return false;

    return this.availableBoards.includes(position.bigBoardIndex);
  }

  isLastMove(position: Position) {
    const lastMove = this.lastMove;
    if (!lastMove) return false;
    return (
      lastMove.position.bigBoardIndex === position.bigBoardIndex &&
      lastMove.position.littleBoardIndex === position.littleBoardIndex
    );
  }

  applyMove(move: Move) {
    const { position, symbol } = move;
    const { bigBoardIndex, littleBoardIndex } = position;
    this.smartBoard[bigBoardIndex].move(littleBoardIndex, symbol);
    this.moves.push(move);
  }

  symbolAtPosition(position: Position) {
    return this.smartBoard[position.bigBoardIndex].board[
      position.littleBoardIndex
    ].symbol;
  }

  abstract loadGame(): void;
  abstract move(playerId: string, position: Position): void;
  abstract get playerX(): any;
  abstract get playerO(): any;
}

type Symbol = "X" | "O" | null;

export type Cell = {
  position: Position;
  symbol: Symbol;
};

// Regular TicTacToe board
// has knowledge of the winner and if the game is over
// but not the sequence of moves
export class TicTacToe {
  board: Cell[];

  constructor(bigBoardIndex: PositionIndex) {
    this.board = BOARD_INDICES.map((littleBoardIndex) => ({
      position: { bigBoardIndex, littleBoardIndex },
      symbol: null,
    }));
  }

  get winner() {
    const result = getWinnerForBoard(this.board.map((cell) => cell.symbol));
    return result;
  }

  get isOver() {
    if (this.winner) return true;
    if (this.board.every((cell) => cell.symbol)) return true;
    return false;
  }

  canMove() {}

  move(position: PositionIndex, symbol: "X" | "O") {
    this.board[position].symbol = symbol;
  }
}

export function getWinnerForBoard(
  board: Symbol[]
): { symbol: Symbol; positions: number[] } | null {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;

    if (!board[a]) continue;

    if (board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a], positions: [a, b, c] };
    }
  }

  return null;
}

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
