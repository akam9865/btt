import { PageLayout } from "@/features/core/ui/PageLayout";
import { GamePage as GamePageComponent } from "@/features/game/components/GamePage";

const GamePage = ({ gameId }: { gameId: string }) => {
  return (
    <PageLayout>
      <GamePageComponent gameId={gameId} />
    </PageLayout>
  );
};

export default GamePage;

export const getServerSideProps = async ({
  query,
}: {
  query: { gameId: string };
}) => {
  return { props: { gameId: query.gameId } };
};
