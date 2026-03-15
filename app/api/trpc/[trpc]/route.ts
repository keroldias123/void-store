import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/src/server/routers/_app"
import { createContext } from "@/src/server/trpc"

export async function GET(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => createContext({ req: request }),
  })
}

export async function POST(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => createContext({ req: request }),
  })
}

export async function OPTIONS(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => createContext({ req: request }),
  })
}
