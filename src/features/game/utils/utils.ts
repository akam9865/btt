import { Position } from "@/stores/game";

export function joinPosition(position: Position): string {
  return [position.bigBoardIndex, position.littleBoardIndex].join("-");
}
