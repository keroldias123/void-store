import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { organization } from "./organization"
import { relations } from "drizzle-orm"

export const outline = pgTable(
  "outline",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    header: text("header").notNull(),
    sectionType: text("section_type").notNull(),
    status: text("status").notNull().default("Pending"),
    target: integer("target").notNull().default(0),
    limit: integer("outline_limit").notNull().default(0),
    reviewer: text("reviewer").notNull().default("Assim"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("outline_organizationId_idx").on(table.organizationId)],
)

export const outlineRelations = relations(outline, ({ one }) => ({
  organization: one(organization, {
    fields: [outline.organizationId],
    references: [organization.id],
  }),
}))
