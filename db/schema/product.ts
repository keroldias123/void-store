    import { pgTable, text, timestamp, uuid, integer, uniqueIndex } from "drizzle-orm/pg-core"
import { organization } from "./organization"
import { category } from "./category"
import { subcategory } from "./subcategory"
import { relations } from "drizzle-orm"

export const product = pgTable(
  "product",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => category.id, { onDelete: "set null" }),
    subcategoryId: uuid("subcategory_id").references(() => subcategory.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    originalPrice: integer("original_price"),
    currency: text("currency").default("AOA").notNull(),
    imageUrl: text("image_url"),
    category: text("category"),
    stock: integer("stock").default(0).notNull(),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_slug_uidx").on(table.slug),
  ]
)

export const productRelations = relations(product, ({ one }) => ({
  organization: one(organization, {
    fields: [product.organizationId],
    references: [organization.id],
  }),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  subcategory: one(subcategory, {
    fields: [product.subcategoryId],
    references: [subcategory.id],
  }),
}))
