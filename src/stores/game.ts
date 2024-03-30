import { joinPosition } from "@/features/game/utils/utils";
import { MoveSchema } from "@/utils/schema/MovesSchema";
import { supabase } from "@/utils/supabase";
import { trpcClient } from "@/utils/trpc";
import assert from "assert";
import {
  action,
  autorun,
  flow,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

// A board will be a 1d array with 9 elements.
// Indices translate to a 3x3 grid as follows:
// 0 1 2
// 3 4 5
// 6 7 8
const BOARD_INDICES: PositionIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Position = {
  bigBoardIndex: PositionIndex;
  littleBoardIndex: PositionIndex;
};

type Move = {
  position: Position;
  symbol: "X" | "O";
};

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

class GameStore {
  gameId: string = "";
  playerX: string = "";
  playerO: string = "";
  moves: Move[] = [];
  smartBoard: BigBoard;

  constructor() {
    this.smartBoard = BOARD_INDICES.map(
      (bigBoardIndex) => new TicTacToe(bigBoardIndex)
    ) as BigBoard;

    makeAutoObservable(this, { applyMove: action });
  }

  get turn(): "X" | "O" {
    return this.moves.length % 2 === 0 ? "X" : "O";
  }

  get playerTurn(): string {
    return this.turn === "X" ? this.playerX : this.playerO;
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

  // results for each small board, e.g. [null, "X", "O", ..., null]
  // big board index has null if there is no winner, or a symbol if someone has won
  get boardResults() {
    return this.smartBoard.map((littleBoard) => {
      // return getWinnerForBoard(littleBoard.map((cell) => cell.symbol));
      return null;
    });
  }

  get winner() {
    // const resultSymbols = this.boardResults.map(
    //   (result) => result?.symbol || null
    // );
    const overallWinner = null; // getWinnerForBoard(resultSymbols);
    if (overallWinner) return overallWinner;
    return null;
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

  canClick(position: Position, playerId: string) {
    const board = this.smartBoard[position.bigBoardIndex];

    if (board.board[position.littleBoardIndex].symbol) return false;
    if (board.isOver) return false;
    if (playerId !== this.playerTurn) return false;

    return this.availableBoards.includes(position.bigBoardIndex);
  }

  protected unsubscribe?: () => void = undefined;

  isLastMove(position: Position) {
    const lastMove = this.lastMove;
    if (!lastMove) return false;
    return (
      lastMove.position.bigBoardIndex === position.bigBoardIndex &&
      lastMove.position.littleBoardIndex === position.littleBoardIndex
    );
  }

  symbolAtPosition(position: Position) {
    return this.smartBoard[position.bigBoardIndex].board[
      position.littleBoardIndex
    ].symbol;
  }

  move = flow(function* (
    this: GameStore,
    playerId: string,
    position: Position
  ) {
    const { gameId, playerTurn } = this;
    const moveSymbol = this.turn;
    const { bigBoardIndex, littleBoardIndex } = position;
    const existingSymbol = this.symbolAtPosition(position);

    assert(playerTurn === playerId, "not your turn");
    assert(existingSymbol === null, "occupied cell");
    assert(gameId, "gameId required");
    assert(playerId, "playerId required");

    try {
      this.applyMove(position, moveSymbol);

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

  applyMove(position: Position, symbol: "X" | "O") {
    const { bigBoardIndex, littleBoardIndex } = position;
    this.smartBoard[bigBoardIndex].move(littleBoardIndex, this.turn);
    this.moves.push({ position, symbol });
  }

  loadGame = flow(function* loadGame(this: GameStore, gameId: string) {
    const [game, moves] = yield Promise.all([
      trpcClient.getGame.query({ gameId }),
      trpcClient.getMoves.query({ gameId }),
    ]);

    this.gameId = game.id;
    this.playerO = game.playerO;
    this.playerX = game.playerX;
    this.moves = moves;

    moves.forEach((move: Move) => {
      const { bigBoardIndex, littleBoardIndex } = move.position;
      this.smartBoard[bigBoardIndex].move(littleBoardIndex, move.symbol);
    });
  });

  // createGame = flow(function* createGame() {});
  // requestGame = flow(function* requestGame() {});

  subscribe(gameId: string) {
    if (this.unsubscribe) return;

    console.log("subscribing to moves for game: ", gameId);
    const movesChannel = supabase.channel("schema-db-changes");
    movesChannel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "moves",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const { position, symbol } = MoveSchema.parse(payload.new);
          const { bigBoardIndex, littleBoardIndex } = position;

          const hasMove = this.moves.find((existingMove) => {
            return (
              existingMove.position.bigBoardIndex === bigBoardIndex &&
              existingMove.position.littleBoardIndex === littleBoardIndex
            );
          });

          if (!hasMove) {
            this.applyMove(position, symbol);
          }
        }
      )
      .subscribe();

    // autorun(() => {
    // console.log("------");
    // console.log(this.lastMove);
    // console.log(this.moves);
    // });

    this.unsubscribe = () => {
      supabase.removeChannel(movesChannel);
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

    makeObservable(this, { board: observable, move: action });
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

  move = (position: PositionIndex, symbol: "X" | "O") => {
    this.board[position].symbol = symbol;
  };
}

export const gameStore = new GameStore();

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
