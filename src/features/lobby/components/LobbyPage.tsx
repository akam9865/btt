import { observer } from "mobx-react-lite";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";

export const LobbyPage = observer(() => {
  const mutation = trpc.findGame.useMutation();
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as { id: string } | undefined;

  const handleCreateGame = () => {
    if (!user?.id) return;
    mutation.mutate({ playerId: user.id });
  };

  useEffect(() => {
    if (mutation.data?.gameId) {
      router.push(`/game/${mutation.data.gameId}`);
    }
  }, [router, mutation.data?.gameId]);

  return (
    <div>
      {/* MyGames - get list of games I'm involved in and can join */}
      <Button onClick={handleCreateGame} variant="outlined">
        Find a Game
      </Button>
    </div>
  );
});
