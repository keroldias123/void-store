import { pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { subcategory } from "./subcategory"

export const category = pgTable(
  "category",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    image: text("image"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("category_slug_uidx").on(table.slug)]
)

export const categoryRelations = relations(category, ({ many }) => ({
  subcategories: many(subcategory),
}))
