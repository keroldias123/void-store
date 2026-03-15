import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "@/src/server/trpc"
import { db } from "@/db"
import { product, organization, member, category, subcategory } from "@/db/schema/schema"
import { eq, desc, and } from "drizzle-orm"

const productInputSchema = z.object({
  organizationId: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  currency: z.string().default("AOA"),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().uuid().optional(),
  subcategoryId: z.string().uuid().optional(),
  category: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const productsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        organizationId: z.string().uuid().optional(),
        categoryId: z.string().uuid().optional(),
        subcategoryId: z.string().uuid().optional(),
      })
    )
    .query(async ({ input }) => {
      const hasFilter = input.organizationId || input.categoryId || input.subcategoryId

      if (hasFilter) {
        return await db.query.product.findMany({
          where: (fields, methods) => {
            const conditions = []
            if (input.organizationId) conditions.push(methods.eq(fields.organizationId, input.organizationId))
            if (input.categoryId) conditions.push(methods.eq(fields.categoryId, input.categoryId))
            if (input.subcategoryId) conditions.push(methods.eq(fields.subcategoryId, input.subcategoryId))
            return conditions.length === 1 ? conditions[0] : and(...conditions)
          },
          orderBy: (fields, { desc }) => desc(fields.createdAt),
        })
      }

      return await db.query.product.findMany({ orderBy: (fields, { desc }) => desc(fields.createdAt) })
    }),

  get: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const found = await db.query.product.findFirst({ where: (fields, { eq }) => eq(fields.id, input.id) })
    if (!found) {
      throw new Error("Produto não encontrado")
    }
    return found
  }),

  create: protectedProcedure.input(productInputSchema).mutation(async ({ input, ctx }) => {
    const org = await db.query.organization.findFirst({
      where: (fields, { eq }) => eq(fields.id, input.organizationId),
    })

    if (!org) {
      throw new Error("Organização não encontrada")
    }

    const memberEntry = await db.query.member.findFirst({
      where: (fields, { and, eq }) =>
        and(eq(fields.organizationId, input.organizationId), eq(fields.userId, ctx.user?.id ?? "")),
    })

    if (!memberEntry || !["owner", "admin", "reseller"].includes(memberEntry.role)) {
      throw new Error("Permissão insuficiente para criar produto")
    }

    const [created] = await db
      .insert(product)
      .values({
        organizationId: input.organizationId,
        categoryId: input.categoryId || null,
        subcategoryId: input.subcategoryId || null,
        title: input.title,
        slug: input.slug,
        description: input.description || "",
        price: Math.round(input.price * 100),
        originalPrice: input.originalPrice ? Math.round(input.originalPrice * 100) : undefined,
        currency: input.currency,
        imageUrl: input.imageUrl || "",
        category: input.category || "",
        stock: input.stock,
        status: input.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return created
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        originalPrice: z.number().min(0).optional(),
        currency: z.string().optional(),
        imageUrl: z.string().url().optional(),
        categoryId: z.string().uuid().optional(),
        subcategoryId: z.string().uuid().optional(),
        category: z.string().optional(),
        stock: z.number().int().min(0).optional(),
        status: z.enum(["active", "inactive"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await db.query.product.findFirst({ where: (fields, { eq }) => eq(fields.id, input.id) })
      if (!existing) {
        throw new Error("Produto não encontrado")
      }

      const memberEntry = await db.query.member.findFirst({
        where: (fields, { and, eq }) =>
          and(eq(fields.organizationId, existing.organizationId), eq(fields.userId, ctx.user?.id ?? "")),
      })
      if (!memberEntry || !["owner", "admin", "reseller"].includes(memberEntry.role)) {
        throw new Error("Permissão insuficiente para editar produto")
      }

      const [updated] = await db
        .update(product)
        .set({
          title: input.title ?? existing.title,
          description: input.description ?? existing.description,
          price: input.price !== undefined ? Math.round(input.price * 100) : existing.price,
          originalPrice:
            input.originalPrice !== undefined ? Math.round(input.originalPrice * 100) : existing.originalPrice,
          currency: input.currency ?? existing.currency,
          imageUrl: input.imageUrl ?? existing.imageUrl,
          categoryId: input.categoryId ?? existing.categoryId,
          subcategoryId: input.subcategoryId ?? existing.subcategoryId,
          category: input.category ?? existing.category,
          stock: input.stock ?? existing.stock,
          status: input.status ?? existing.status,
          updatedAt: new Date(),
        })
        .where(eq(product.id, input.id))
        .returning()

      return updated
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ input, ctx }) => {
    const existing = await db.query.product.findFirst({ where: (fields, { eq }) => eq(fields.id, input.id) })
    if (!existing) {
      throw new Error("Produto não encontrado")
    }

    const memberEntry = await db.query.member.findFirst({
      where: (fields, { and, eq }) =>
        and(eq(fields.organizationId, existing.organizationId), eq(fields.userId, ctx.user?.id ?? "")),
    })
    if (!memberEntry || !["owner", "admin"].includes(memberEntry.role)) {
      throw new Error("Permissão insuficiente para excluir produto")
    }

    await db.delete(product).where(eq(product.id, input.id))
    return { success: true }
  }),
})
