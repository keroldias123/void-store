// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/src/server/routers/_app";
import { createContext } from "@/src/server/trpc";
import {  } from "@/app/api/trpc/[trpc]/route" // ✅ IMPORT CORRETO - sempre '@/trpc/react';
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });

export { handler as GET, handler as POST, handler as OPTIONS };
