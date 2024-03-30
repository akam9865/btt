import z from "zod";

export const GameSchema = z
  .object({
    id: z.string(),
    player_x: z.string(),
    player_o: z.string().nullable(),
    created_at: z.date(),
  })
  .transform((game) => ({
    id: game.id,
    playerX: game.player_x,
    playerO: game.player_o,
    createdAt: game.created_at,
  }));
