import { Move } from "@/utils/schema/MovesSchema";

// Returns a formatted string of the position with human readable
// indices for display and react key purposes only.
export function joinPosition(position: Move["position"]): string {
  return [position.bigBoardIndex + 1, position.littleBoardIndex + 1].join("-");
}
