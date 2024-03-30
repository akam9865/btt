import { PageLayout } from "@/features/core/ui/PageLayout";
import { LobbyPage as LobbyPageComponent } from "@/features/lobby/components/LobbyPage";

export default function Home() {
  return (
    <PageLayout>
      <LobbyPageComponent />
    </PageLayout>
  );
}
