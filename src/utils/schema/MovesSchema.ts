import z from "zod";

const IndicesSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);

export const MoveSchema = z
  .object({
    big_board_index: IndicesSchema,
    little_board_index: IndicesSchema,
    player_id: z.string(),
    move_symbol: z.enum(["X", "O"]),
  })
  .transform((move) => ({
    position: {
      bigBoardIndex: move.big_board_index,
      littleBoardIndex: move.little_board_index,
    },
    symbol: move.move_symbol,
    playerId: move.player_id,
  }));

export const MovesSchema = z.array(MoveSchema);
