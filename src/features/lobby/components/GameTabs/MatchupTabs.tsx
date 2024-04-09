import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Tab, Tabs, styled } from "@mui/material";
import { lobbyStore } from "@/stores/lobby";
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
      <Content>
        {tab === Panels.LOBBY ? (
          <GamesList games={joinableGames} />
        ) : tab === Panels.MY ? (
          <GamesList games={games} />
        ) : tab === Panels.CREATE ? (
          <CreateGamePanel />
        ) : null}
      </Content>
    </TabsContainer>
  );
});

const Content = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  height: "100%",
});

const TabsContainer = styled("div")(({ theme }) => ({
  boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius,
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 200,
}));
