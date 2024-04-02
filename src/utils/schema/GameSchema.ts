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
    playerX: UserSchema.nullable(),
    playerO: UserSchema.nullable(),
  })
  .transform((game) => ({
    id: game.id,
    createdAt: game.created_at,
    playerX: game.playerX
      ? {
          id: game.playerX.id,
          name: game.playerX.name,
          image: game.playerX.image,
        }
      : null,
    playerO: game.playerO
      ? {
          id: game.playerO.id,
          name: game.playerO.name,
          image: game.playerO.image,
        }
      : null,
  }));
