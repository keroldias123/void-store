import { pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core"
import { category } from "./category"
import { relations } from "drizzle-orm"

export const subcategory = pgTable(
  "subcategory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").notNull().references(() => category.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    image: text("image"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("subcategory_slug_uidx").on(table.slug)]
)

export const subcategoryRelations = relations(subcategory, ({ one }) => ({
  category: one(category, {
    fields: [subcategory.categoryId],
    references: [category.id],
  }),
}))
