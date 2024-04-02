import z from "zod";

export const GameSchema = z
  .object({
    id: z.string(),
    created_at: z.date(),
    x_id: z.string(),
    x_name: z.string(),
    x_image: z.string(),
    o_id: z.string(),
    o_name: z.string(),
    o_image: z.string(),
  })
  .transform((game) => ({
    id: game.id,
    createdAt: game.created_at,
    playerX: {
      id: game.x_id,
      name: game.x_name,
      image: game.x_image,
    },
    playerO: {
      id: game.o_id,
      name: game.o_name,
      image: game.o_image,
    },
  }));
