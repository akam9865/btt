import { joinPosition } from "@/features/game/utils/utils";
import { usersStore } from "@/stores/users";
import { MoveSchema, type Move } from "@/utils/schema/MovesSchema";
import { supabase } from "@/utils/supabase";
import { trpcClient } from "@/utils/trpc";
import assert from "assert";
import {
  action,
  flow,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
// import { usersStore } from "./users";

// A board will be a 1d array with 9 elements.
// Indices translate to a 3x3 grid as follows:
// 0 1 2
// 3 4 5
// 6 7 8
const BOARD_INDICES: PositionIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Position = Move["position"];

type BigBoard = [
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
    // makeObservable(this, {moves: observable, applyMove: action});
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
    return getWinnerForBoard(boardResults);
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

  reset() {
    this.gameId = "";
    this.playerXId = null;
    this.playerOId = null;
    this.moves = [];
    this.smartBoard = BOARD_INDICES.map(
      (bigBoardIndex) => new TicTacToe(bigBoardIndex)
    ) as BigBoard;
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

export class RealGame extends AbstractGame {
  protected unsubscribe?: () => void = undefined;

  get playerX() {
    if (!this.playerXId) return;
    return usersStore.get(this.playerXId);
  }

  get playerO() {
    if (!this.playerOId) return;
    return usersStore.get(this.playerOId);
  }

  move = flow(function* (this: RealGame, playerId: string, position: Position) {
    const { gameId, turnPlayerId } = this;
    const moveSymbol = this.turnSymbol;
    const { bigBoardIndex, littleBoardIndex } = position;
    const existingSymbol = this.symbolAtPosition(position);

    assert(turnPlayerId === playerId, "not your turn");
    assert(existingSymbol === null, "occupied cell");
    assert(gameId, "gameId required");
    assert(playerId, "playerId required");

    try {
      this.applyMove({ position, symbol: moveSymbol, playerId });

      yield trpcClient.saveMove.mutate({
        gameId,
        playerId,
        symbol: moveSymbol,
        bigBoardIndex,
        littleBoardIndex,
      });
    } catch {
      // unapply move
    }
  });

  async loadGame() {
    try {
      const { gameId } = this;

      const [game, moves] = await Promise.all([
        trpcClient.getGame.query({ gameId }),
        trpcClient.getMoves.query({ gameId }),
      ]);

      console.log(game, moves);

      Promise.all(
        [game.playerXId, game.playerOId].map((userId) =>
          userId ? usersStore.resolveUser(userId) : null
        )
      );

      runInAction(() => {
        this.playerXId = game.playerXId;
        this.playerOId = game.playerOId;
        this.createdAt = new Date(game.createdAt);
        this.moves = moves;

        moves.forEach((move: Move) => {
          const { bigBoardIndex, littleBoardIndex } = move.position;
          this.smartBoard[bigBoardIndex].move(littleBoardIndex, move.symbol);
        });
      });
    } catch {
      // do something
    }
  }

  subscribe() {
    if (this.unsubscribe) return;
    const { gameId } = this;
    console.log("subscribing to moves for game: ", gameId);
    const schemaDbChangesChannel = supabase.channel("schema-db-changes");
    schemaDbChangesChannel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "moves",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const move = MoveSchema.parse(payload.new);
          const { bigBoardIndex, littleBoardIndex } = move.position;

          const hasMove = this.moves.find((existingMove) => {
            return (
              existingMove.position.bigBoardIndex === bigBoardIndex &&
              existingMove.position.littleBoardIndex === littleBoardIndex
            );
          });

          if (!hasMove) {
            this.applyMove(move);
          }
        }
      )
      .subscribe();

    this.unsubscribe = () => {
      supabase.removeChannel(schemaDbChangesChannel);
    };
    return this.unsubscribe;
  }
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

  move(position: PositionIndex, symbol: "X" | "O") {
    this.board[position].symbol = symbol;
  }
}

// export const gameStore = new GameStore();

// TABLES
// -------
// Games
//   startTime
//   endTime
//   result
// Users
// Participants ?
//   player_id
//   game_id
//   score
// Moves
//   game_id
//   player/participant_id
//   move_number

function getWinnerForBoard(
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
