import { User } from "@/utils/schema/UserSchema";
import { AbstractGame, Position } from "./AbstractGame";
import { MinimaxGame } from "./MinimaxGame";
import { megaMinimaxV2 } from "../utils/ai/megaMinimaxV2";

export class ComputerGame extends AbstractGame {
  computerSymbol: "X" | "O";
  isThinking: boolean = false; // make this a more generic indicator of whos turn it is

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

  move(position: Position, playerId: string = "dave") {
    this.applyMove({ position, playerId, symbol: this.turnSymbol });

    // run in new thread
    setTimeout(() => {
      this.computerMove();
    });
  }

  computerMove() {
    if (this.isOver) return;
    const computerMove = this.pickBestOrRandomMove();

    this.applyMove({
      position: computerMove,
      playerId: "dblue",
      symbol: this.computerSymbol,
    });
  }

  private pickBestOrRandomMove(): Position {
    const minimaxGame = new MinimaxGame("mini", this.moves);
    this.isThinking = true;
    const move = megaMinimaxV2(minimaxGame, 0, true);
    this.isThinking = false;

    if (move.score === 0 || !move.position) {
      return this.availableMoves[
        Math.floor(Math.random() * this.availableMoves.length)
      ];
    }

    return move.position;
  }

  get playerO(): User {
    return { id: "dblue", name: "Deep Blue", image: "" };
  }

  get playerX(): User {
    return { id: "dave", name: "Dave", image: "" };
  }

  loadGame(): void {}
}
