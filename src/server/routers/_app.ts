import { z } from "zod";
import { procedure, router } from "../trpc";
import { sql } from "../supabase";
import { MovesSchema } from "@/utils/schema/MovesSchema";
import { GameSchema } from "@/utils/schema/GameSchema";

export const appRouter = router({
  findGame: procedure
    .input(z.object({ playerId: z.string() }))
    .mutation(async (opts) => {
      const [game] =
        await sql`select * from games where player_o is null limit 1`;

      if (game) {
        await sql`UPDATE games SET player_o = ${opts.input.playerId} WHERE id = ${game.id}`;
        return { gameId: game.id };
      } else {
        const [newGame] =
          await sql`INSERT INTO games (player_x) VALUES (${opts.input.playerId}) RETURNING *`;
        return { gameId: newGame.id };
      }
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

      const playerIds = [game.player_x, game.player_o].filter(Boolean);

      const [data] = await Promise.all(
        playerIds.map(
          (id) => sql`SELECT * FROM next_auth.users WHERE id = ${id}`
        )
      );
      const playerX = data[0] || null;
      const playerO = data[1] || null;

      //       const [game] = await sql`
      //         SELECT
      //           games.id,
      //           games.created_at,
      //           x.id as x_id,
      //           x.name as x_name,
      //           x.image as x_image,
      //           o.id as o_id,
      //           o.name as o_name,
      //           o.image as o_image
      //         FROM
      //           games
      //           JOIN next_auth.users x ON games.player_x = x.id
      //           JOIN next_auth.users o ON games.player_o = o.id
      //         WHERE
      //           games.id = ${gameId}
      // `;
      // const game = {
      //   id: "7",
      //   gameId: "hi",
      //   created_at: "2024-03-19T00:34:02.386Z",
      //   player_x: "7029e705-5edb-4520-841c-648b73492c45",
      //   player_o: "f0df116b-b53c-4bea-aced-0b492572870d",
      //   start_time: null,
      //   end_time: null,
      // };

      return GameSchema.parse({
        ...game,
        playerX,
        playerO,
      });
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
