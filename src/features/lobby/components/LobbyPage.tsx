import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { sessionStore } from "@/stores/session";

export const LobbyPage = observer(() => {
  const mutation = trpc.findGame.useMutation();
  const router = useRouter();

  const handleCreateGame = () => {
    if (!sessionStore.uuid) return;
    mutation.mutate({ playerId: sessionStore.uuid });
  };

  useEffect(() => {
    if (mutation.data?.gameId) {
      router.push(`/game/${mutation.data.gameId}`);
    }
  }, [router, mutation.data?.gameId]);

  return (
    <div>
      {/* MyGames - get list of games I'm involved in and can join */}
      <button onClick={handleCreateGame}>Find a Game</button>
    </div>
  );
});
