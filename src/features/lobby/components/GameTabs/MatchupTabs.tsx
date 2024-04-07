import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Tab, Tabs, styled } from "@mui/material";
import { lobbyStore } from "@/stores/games";
import { GamesList } from "./GamesList";
import { CreateGamePanel } from "./CreateGamePanel";

enum Panels {
  LOBBY = "lobby",
  MY = "my",
  CREATE = "create",
}

export const MatchupsTabs = observer(() => {
  const [tab, setTab] = useState<Panels>(Panels.LOBBY);
  const { games, joinableGames } = lobbyStore;

  return (
    <TabsContainer>
      <Tabs value={tab}>
        <Tab
          value={Panels.LOBBY}
          label={"Lobby"}
          onClick={() => setTab(Panels.LOBBY)}
        />
        <Tab
          value={Panels.MY}
          label={"My Games"}
          onClick={() => setTab(Panels.MY)}
        />
        <Tab
          value={Panels.CREATE}
          label={"Create Game"}
          onClick={() => setTab(Panels.CREATE)}
        />
      </Tabs>
      {tab === Panels.LOBBY ? (
        <GamesList games={joinableGames} />
      ) : tab === Panels.MY ? (
        <GamesList games={games} />
      ) : tab === Panels.CREATE ? (
        <CreateGamePanel />
      ) : null}
    </TabsContainer>
  );
});

const Content = styled("div")(({ theme }) => ({}));
const TabsContainer = styled("div")(({ theme }) => ({}));
