import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./user";
import { relations } from "drizzle-orm";

export const invitation = pgTable(
    "invitation",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      organizationId: uuid("organization_id")
        .notNull()
        .references(() => organization.id, { onDelete: "cascade" }),
      email: text("email").notNull(),
      role: text("role"),
      status: text("status").default("pending").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      inviterId: uuid("inviter_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [
      index("invitation_organizationId_idx").on(table.organizationId),
      index("invitation_email_idx").on(table.email),
    ],
  );

  export const invitationRelations = relations(invitation, ({ one }) => ({
    organization: one(organization, {
      fields: [invitation.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [invitation.inviterId],
      references: [user.id],
    }),
  }));