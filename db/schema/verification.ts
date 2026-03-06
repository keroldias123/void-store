import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const verification = pgTable(
    "verification",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      identifier: text("identifier").notNull(),
      value: text("value").notNull(),
      userId: text("user_id").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    },
    (table) => [
      index("verification_identifier_idx").on(table.identifier),
      uniqueIndex("verification_identifier_value_idx").on(table.identifier, table.value),
    ],
  );