import { User } from "@/utils/schema/UserSchema";
import { AbstractGame, BigBoard, Position } from "./AbstractGame";
import { Move } from "@/utils/schema/MovesSchema";

export class ComputerGame extends AbstractGame {
  computerSymbol: "X" | "O";

  constructor(gameId: string, private playerSymbol: "X" | "O" = "X") {
    super(gameId);
    this.computerSymbol = playerSymbol === "X" ? "O" : "X";
  }

  // TODO: dedupe this across game types
  canClick(position: Position, playerId?: string | undefined): boolean {
    if (this.turnSymbol !== this.playerSymbol) return false;
    if (this.winner) return false;

    const board = this.smartBoard[position.bigBoardIndex];

    if (board.board[position.littleBoardIndex].symbol) return false;
    if (board.isOver) return false;

    return this.availableBoards.includes(position.bigBoardIndex);
  }

  move(position: Position, playerId: string) {
    this.applyMove({ position, playerId, symbol: this.turnSymbol });

    setTimeout(() => {
      const computerMove = this.pickRandomMove();
      this.applyMove(computerMove);
    }, 1);
  }

  private pickRandomMove(): Move {
    const availablePositions = this.availableMoves;
    const index = Math.floor(Math.random() * availablePositions.length);

    return {
      position: availablePositions[index],
      playerId: "123",
      symbol: this.computerSymbol,
    };
  }

  get playerO(): User {
    return { id: "123", name: "Deep Blue", image: "" };
  }

  get playerX(): User {
    return { id: "123", name: "Dave", image: "" };
  }

  loadGame(): void {}
}

function pickRandomPosition(board: BigBoard): Move {
  const yolo = board.flatMap((tt) => {
    if (tt.isOver) return [];

    return tt.board.flatMap((c) => {
      if (!c.symbol) return [c.position];
      return [];
    });
  });

  const index = Math.floor(Math.random() * yolo.length);
  return { position: yolo[index], playerId: "123", symbol: "O" };
  //   return yolo.map();
}
import "../utils/minimax2";
