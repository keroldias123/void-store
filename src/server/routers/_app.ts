import { router } from "@/src/server/trpc"
import { productsRouter } from "@/src/server/routers/products"
import { categoriesRouter } from "@/src/server/routers/categories"

export const appRouter = router({
  products: productsRouter,
  categories: categoriesRouter,
})

export type AppRouter = typeof appRouter
