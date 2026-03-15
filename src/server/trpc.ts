import { initTRPC, TRPCError } from "@trpc/server"
import { getSessionUser } from "@/lib/auth"
import { db } from "@/db"

export async function createContext({ req }: { req: Request }) {
  const sessionUser = await getSessionUser(req)
  return {
    db,
    user: sessionUser,
  }
}

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" })
  }
  return next({ ctx })
})

export const ownerOrAdminOrResellerProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({ ctx })
})
