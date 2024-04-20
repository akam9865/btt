import assert from "assert";
import { AbstractGame, Position } from "./AbstractGame";
import { User } from "@/utils/schema/UserSchema";

export class LocalGame extends AbstractGame {
  constructor(gameId: string) {
    super(gameId);
    this.playerXId = "123";
    this.playerOId = "123";
  }

  canClick(position: Position): boolean {
    if (this.winner) return false;

    const board = this.smartBoard[position.bigBoardIndex];

    if (board.board[position.littleBoardIndex].symbol) return false;
    if (board.isOver) return false;

    return this.availableBoards.includes(position.bigBoardIndex);
  }

  move(position: Position) {
    assert(this.turnPlayerId);

    this.applyMove({
      position,
      symbol: this.turnSymbol,
      playerId: this.turnPlayerId,
    });
  }

  // TODO: use real images for local players
  get playerO(): User {
    return { id: "123", name: "Orenthal", image: "" };
  }

  get playerX(): User {
    return { id: "123", name: "Xerxes", image: "" };
  }

  loadGame(): void {}
}
