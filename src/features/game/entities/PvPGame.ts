import { usersStore } from "@/stores/users";
import { MoveSchema, type Move } from "@/utils/schema/MovesSchema";
import { supabase } from "@/utils/supabase";
import { trpcClient } from "@/utils/trpc";
import assert from "assert";
import { action, flow, makeObservable, runInAction } from "mobx";
import { AbstractGame, Position } from "./AbstractGame";

export class PvPGame extends AbstractGame {
  constructor(public gameId: string) {
    super(gameId);

    makeObservable(this, { move: action, subscribe: action });
  }

  protected unsubscribe?: () => void = undefined;

  get playerX() {
    if (!this.playerXId) return;
    return usersStore.get(this.playerXId);
  }

  get playerO() {
    if (!this.playerOId) return;
    return usersStore.get(this.playerOId);
  }

  move = flow(function* (this: PvPGame, playerId: string, position: Position) {
    const { gameId, turnPlayerId } = this;
    const moveSymbol = this.turnSymbol;
    const { bigBoardIndex, littleBoardIndex } = position;
    const existingSymbol = this.symbolAtPosition(position);

    assert(turnPlayerId === playerId, "not your turn");
    assert(existingSymbol === null, "occupied cell");
    assert(gameId, "gameId required");
    assert(playerId, "playerId required");

    try {
      this.applyMove({ position, symbol: moveSymbol, playerId });

      yield trpcClient.saveMove.mutate({
        gameId,
        playerId,
        symbol: moveSymbol,
        bigBoardIndex,
        littleBoardIndex,
      });
    } catch {
      // unapply move
    }
  });

  async loadGame() {
    try {
      const { gameId } = this;

      const [game, moves] = await Promise.all([
        trpcClient.getGame.query({ gameId }),
        trpcClient.getMoves.query({ gameId }),
      ]);

      Promise.all(
        [game.playerXId, game.playerOId].map((userId) =>
          userId ? usersStore.resolveUser(userId) : null
        )
      );

      runInAction(() => {
        this.playerXId = game.playerXId;
        this.playerOId = game.playerOId;
        this.createdAt = new Date(game.createdAt);
        this.moves = moves;

        moves.forEach((move: Move) => {
          const { bigBoardIndex, littleBoardIndex } = move.position;
          this.smartBoard[bigBoardIndex].move(littleBoardIndex, move.symbol);
        });
      });
    } catch {
      // do something
    }
  }

  subscribe() {
    if (this.unsubscribe) return;
    const { gameId } = this;
    console.log("subscribing to moves for game: ", gameId);
    const schemaDbChangesChannel = supabase.channel("schema-db-changes");
    schemaDbChangesChannel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "moves",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const move = MoveSchema.parse(payload.new);
          const { bigBoardIndex, littleBoardIndex } = move.position;

          const hasMove = this.moves.find((existingMove) => {
            return (
              existingMove.position.bigBoardIndex === bigBoardIndex &&
              existingMove.position.littleBoardIndex === littleBoardIndex
            );
          });

          if (!hasMove) {
            this.applyMove(move);
          }
        }
      )
      .subscribe();

    this.unsubscribe = () => {
      supabase.removeChannel(schemaDbChangesChannel);
    };
    return this.unsubscribe;
  }
}
