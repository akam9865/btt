import { sessionStore } from "@/stores/session";
import { styled } from "@mui/system";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Link from "next/link";

export const PageLayout = observer(
  ({ children }: { children: React.ReactNode }) => {
    const { uuid } = sessionStore;
    return (
      <>
        <Head>
          <title>BTT</title>
          <meta name="description" content="A game" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Page>
          <Header>
            <Link href="/">Mega Tac Toe</Link>
            <div>{uuid}</div>
          </Header>
          <Content>{children}</Content>
        </Page>
      </>
    );
  }
);

const Page = styled("div")(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
}));

const Header = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: "12px 24px",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 24,
}));

const Content = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    margin: "0 auto",
    flexGrow: 1,
  },
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
  },
}));
