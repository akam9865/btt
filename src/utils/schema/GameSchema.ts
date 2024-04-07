import z from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
});

export const GameSchema = z
  .object({
    id: z.string(),
    created_at: z.date(),
    player_x: z.string().nullable(),
    player_o: z.string().nullable(),
  })
  .transform((game) => ({
    id: game.id,
    createdAt: game.created_at,
    playerXId: game.player_x,
    playerOId: game.player_o,
  }));

export type Game = z.infer<typeof GameSchema>;
