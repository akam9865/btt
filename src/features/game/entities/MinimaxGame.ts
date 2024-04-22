import { User } from "@/utils/schema/UserSchema";
import { AbstractGame, Position } from "./AbstractGame";
import { Move } from "@/utils/schema/MovesSchema";

export class MinimaxGame extends AbstractGame {
  constructor(gameId: string, initialMoves: Move[] = []) {
    super(gameId);

    initialMoves.forEach((move) => this.applyMove(move));
  }

  canClick(): boolean {
    return true;
  }

  move() {
    throw "Not implemented";
  }

  get playerO(): User {
    return { id: "123", name: "Orenthal", image: "" };
  }

  get playerX(): User {
    return { id: "123", name: "Xerxes", image: "" };
  }

  loadGame(): void {}

  printBoard() {
    this.printRow([0, 1, 2]);
    console.log("-----------------------");
    this.printRow([3, 4, 5]);
    console.log("-----------------------");
    this.printRow([6, 7, 8]);
  }

  printRow(row: number[]) {
    const top: string[] = [];
    row.forEach((i) => {
      [0, 1, 2].forEach((j) => {
        top.push(this.smartBoard[i].board[j].symbol || "-");
      });
      top.push("|");
    });
    const middle: string[] = [];
    row.forEach((i) => {
      [3, 4, 5].forEach((j) => {
        middle.push(this.smartBoard[i].board[j].symbol || "-");
      });
      middle.push("|");
    });
    const bottom: string[] = [];
    row.forEach((i) => {
      [6, 7, 8].forEach((j) => {
        bottom.push(this.smartBoard[i].board[j].symbol || "-");
      });
      bottom.push("|");
    });

    console.log(top.join(" "));
    console.log(middle.join(" "));
    console.log(bottom.join(" "));
  }
}
