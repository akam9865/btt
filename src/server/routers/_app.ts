import { z } from "zod";
import { procedure, router } from "../trpc";
import { sql } from "../supabase";
import { MovesSchema } from "@/utils/schema/MovesSchema";
import { GameSchema } from "@/utils/schema/GameSchema";
import { UserSchema } from "@/utils/schema/UserSchema";

export const appRouter = router({
  getUser: procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const [user] = await sql`
        SELECT * FROM next_auth.users WHERE id = ${input.userId}
      `;

      return UserSchema.parse(user);
    }),
  createGame: procedure
    .input(z.object({ playerId: z.string(), symbol: z.string() }))
    .mutation(async ({ input }) => {
      const query =
        input.symbol === "X"
          ? sql`INSERT INTO games (player_x) VALUES (${input.playerId}) RETURNING *`
          : sql`INSERT INTO games (player_o) VALUES (${input.playerId}) RETURNING *`;

      const [newGame] = await query;

      return { gameId: newGame.id };
    }),
  joinGame: procedure
    .input(
      z.object({ playerId: z.string(), symbol: z.string(), gameId: z.string() })
    )
    .mutation(async ({ input }) => {
      const query =
        input.symbol === "X"
          ? sql`UPDATE games SET player_x = ${input.playerId} WHERE id = ${input.gameId} RETURNING *`
          : sql`UPDATE games SET player_o = ${input.playerId} WHERE id = ${input.gameId} RETURNING *`;
      const [game] = await query;
      return { gameId: game.id };
    }),

  findGame: procedure
    .input(z.object({ playerId: z.string() }))
    .mutation(async ({ input }) => {
      const [existingGame] = await sql`
        SELECT * FROM games WHERE player_o IS NULL AND player_x = ${input.playerId} LIMIT 1
      `;

      if (existingGame) {
        return { gameId: existingGame.id };
      }

      const [game] =
        await sql`select * from games where player_o is null and player_x != ${input.playerId} limit 1`;

      if (game) {
        await sql`UPDATE games SET player_o = ${input.playerId} WHERE id = ${game.id}`;
        return { gameId: game.id };
      } else {
        const [newGame] =
          await sql`INSERT INTO games (player_x) VALUES (${input.playerId}) RETURNING *`;
        return { gameId: newGame.id };
      }
    }),

  getGames: procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const games = await sql`
        SELECT * FROM games WHERE player_o = ${input.userId} OR player_x = ${input.userId}
      `;

      return games.map((game) => GameSchema.parse(game));
    }),

  getJoinableGames: procedure.query(async () => {
    const games = await sql`
        SELECT * FROM games
        WHERE (player_o IS NULL AND player_x IS NOT NULL)
        OR (player_x IS NULL AND player_o IS NOT NULL)
      `;

    return games.map((game) => GameSchema.parse(game));
  }),

  getGame: procedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ input }) => {
      const { gameId } = input;
      const [game] = await sql`
        SELECT
          *
        FROM
          games
        WHERE
          games.id = ${gameId}
      `;

      return GameSchema.parse(game);
    }),

  getMoves: procedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ input }) => {
      const moves =
        await sql`SELECT * FROM moves WHERE game_id = ${input.gameId}`;

      // const moves = [
      //   {
      //     id: "15",
      //     created_at: "2024-03-29T21:22:38.026Z",
      //     game_id: "7",
      //     player_id: "7029e705-5edb-4520-841c-648b73492c45",
      //     move_number: null,
      //     move_symbol: "X",
      //     big_board_index: 8,
      //     little_board_index: 8,
      //   },
      //   // {
      //   //   id: "15",
      //   //   created_at: "2024-03-29T21:22:38.026Z",
      //   //   game_id: "7",
      //   //   player_id: "f0df116b-b53c-4bea-aced-0b492572870d",
      //   //   move_number: null,
      //   //   move_symbol: "O",
      //   //   big_board_index: 7,
      //   //   little_board_index: 8,
      //   // },
      // ];
      return MovesSchema.parse(moves);
    }),

  saveMove: procedure
    .input(
      z.object({
        gameId: z.string(),
        playerId: z.string(),
        symbol: z.string(),
        bigBoardIndex: z.number(),
        littleBoardIndex: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await sql`
        INSERT INTO moves (game_id, player_id, move_symbol, big_board_index, little_board_index)
        VALUES (${input.gameId}, ${input.playerId}, ${input.symbol}, ${input.bigBoardIndex}, ${input.littleBoardIndex})
      `;
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;

// Games API
// - createGame
// - joinGame
// - getGame
