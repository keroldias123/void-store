import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";

export const session = pgTable(
    "session",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      expiresAt: timestamp("expires_at").notNull(),
      token: text("token").notNull().unique(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
      activeOrganizationId: text("active_organization_id"),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
  );

  export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
      fields: [session.userId],
      references: [user.id],
    }),
  }));