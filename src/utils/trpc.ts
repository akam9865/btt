import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const links = [
  httpBatchLink({
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/v11/ssr
     **/
    url: `${getBaseUrl()}/api/trpc`,

    // You can pass any HTTP headers you wish here
    async headers() {
      return {
        // authorization: getAuthCookie(),
      };
    },
  }),
];

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      links,
    };
  },
  /**
   * @link https://trpc.io/docs/v11/ssr
   **/
  ssr: false,
});

export const trpcClient = createTRPCClient<AppRouter>({ links });
