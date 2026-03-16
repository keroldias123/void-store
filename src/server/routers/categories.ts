import { z } from "zod"
import { router, protectedProcedure, publicProcedure,createTRPCRouter } from "@/src/server/trpc"
import { db } from "@/db"
import { category, subcategory, member, product } from "@/db/schema/schema"
import { eq, desc, inArray } from "drizzle-orm"

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().url().optional(),
  description: z.string().optional(),
})

const subcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().url().optional(),
  description: z.string().optional(),
})

async function assertAdminOrOwner(userId: string | undefined) {
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const memberEntry = await db.query.member.findFirst({
    where: (fields, { eq }) => eq(fields.userId, userId),
  })

  if (!memberEntry || !["owner", "admin"].includes(memberEntry.role)) {
    throw new Error("Permissão insuficiente: apenas owner/admin pode gerenciar categorias")
  }

  return true
}

export const categoriesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.query.category.findMany({ orderBy: (fields, { asc }) => asc(fields.name) })
  }),

  listWithSubcategories: publicProcedure.query(async () => {
    return await db.query.category.findMany({
      with: {
        subcategories: true,
      },
      orderBy: (fields, { asc }) => asc(fields.name),
    })
  }),

  createCategory: protectedProcedure.input(categorySchema).mutation(async ({ input, ctx }) => {
    await assertAdminOrOwner(ctx.user?.id)

    const [created] = await db.insert(category).values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return created
  }),

  createSubcategory: protectedProcedure.input(subcategorySchema).mutation(async ({ input, ctx }) => {
    await assertAdminOrOwner(ctx.user?.id)

    const parent = await db.query.category.findFirst({ where: (fields, { eq }) => eq(fields.id, input.categoryId) })
    if (!parent) {
      throw new Error("Categoria pai não encontrada")
    }

    const [created] = await db.insert(subcategory).values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return created
  }),

  deleteCategory: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ input, ctx }) => {
    await assertAdminOrOwner(ctx.user?.id)
    await db.delete(category).where(eq(category.id, input.id))
    return { success: true }
  }),

  deleteSubcategory: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ input, ctx }) => {
    await assertAdminOrOwner(ctx.user?.id)
    await db.delete(subcategory).where(eq(subcategory.id, input.id))
    return { success: true }
  }),
})

export const searchRouter = createTRPCRouter({
  searchProducts: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { query, category: catSlug } = input;

      const products = await db.query.product.findMany({
        where: (fields, { and, or, like, eq }) => {
          const conditions = [];
          if (query) {
            conditions.push(
              or(
                like(fields.title, `%${query}%`),
                like(fields.description, `%${query}%`)
              )
            );
          }
          if (catSlug) {
            conditions.push(eq(fields.category, catSlug));
          }
          return conditions.length > 0 ? and(...conditions) : undefined;
        },
        orderBy: [desc(product.createdAt)],
      });

      const uniqueCatNames = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

      const relevantCategories = uniqueCatNames.length > 0
        ? await db.query.category.findMany({
            where: inArray(category.name, uniqueCatNames),
            with: { subcategories: true },
          })
        : [];

      return {
        products,
        categories: relevantCategories,
        total: products.length,
      };
    }),
});