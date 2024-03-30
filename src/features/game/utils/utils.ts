import { Position } from "@/stores/game";

// Returns a formatted string of the position with human readable
// indices for display and react key purposes only.
export function joinPosition(position: Position): string {
  return [position.bigBoardIndex + 1, position.littleBoardIndex + 1].join("-");
}
