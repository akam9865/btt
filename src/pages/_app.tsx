import "../globals";
import "@/styles/globals.css";

import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { sessionStore } from "@/stores/session";
import { trpc } from "@/utils/trpc";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/utils/theme";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    sessionStore.setUuid();
  }, []);

  return (
    <AppCacheProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </AppCacheProvider>
  );
}
export default trpc.withTRPC(App);
